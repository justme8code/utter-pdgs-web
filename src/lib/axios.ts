// lib/api/axios.ts

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

const BASE_URL = process.env.NEXT_PRIVATE_BACKEND_URL;

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/json"},
});

// A custom error type for our interceptor to use
class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === "Network Error" || !error.response) {
            // Reject with a custom, identifiable error object
            return Promise.reject(new NetworkError("Network error. Please check your connection."));
        }
        return Promise.reject(error);
    }
);

export interface ResponseModel<T> {
    data: T | null;
    status: number;
    error: { state: boolean; message: string };
}

export async function myRequest<T, R>(options: AxiosRequestConfig & { data?: T }): Promise<ResponseModel<R>> {
    try {
        const response = await axiosInstance({...options});
        return {
            data: response.data,
            status: response.status,
            error: {state: false, message: ""},
        };
    } catch (error: unknown) {
        console.error("API Request Error:", error);

        // Check if it's our custom NetworkError
        if (error instanceof NetworkError) {
            return {
                data: null,
                status: 503, // Service Unavailable
                error: {state: true, message: error.message},
            };
        }

        // 2. Check if it's an AxiosError (most common case)
        if (axios.isAxiosError(error)) {
            // Now TypeScript knows `error` has properties like `response`
            const status = error.response?.status || 500;
            const responseData = error.response?.data;

            // Type guard to check if the response data has a 'message' property
            const getErrorMessage = (data: unknown): string => {
                if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
                    return data.message;
                }
                if (typeof data === 'string') {
                    return data;
                }
                return "An error occurred, but the server did not provide a message.";
            };

            const errorMessage = getErrorMessage(responseData);

            return {
                data: responseData || null,
                status: status,
                error: {state: true, message: errorMessage},
            };
        }

        // Handle other, unexpected error types (e.g., if it's a standard Error object)
        if (error instanceof Error) {
            return {
                data: null,
                status: 500,
                error: {state: true, message: error.message},
            };
        }

        // Fallback for truly unknown error types
        return {
            data: null,
            status: 500,
            error: {state: true, message: "An unexpected and untyped error occurred"},
        };
    }
}