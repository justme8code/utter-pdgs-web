import axios, {AxiosRequestConfig} from "axios";
import {BASE_URL} from "@/app/api/urls";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === "Network Error" || !error.response) {
            return Promise.reject({ error: { state: true, message: "Network error. Please check your connection." } });
        }
        return Promise.reject(error);
    }
);


export interface ResponseModel<T> {
    data:T,
    status:number,
    error:{ state:boolean, message:string }
}


export async function myRequest<T, R>(options: AxiosRequestConfig & { data?: T }): Promise<ResponseModel<R>> {
    try {
        const response = await axiosInstance({ ...options });

        return {
            data: response.data,
            status: response.status,
            error: { state: false, message: "" },
        };
    } catch (error: unknown) {
        console.error("API Request Error:", error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const errorMessage =
                error.response?.data?.message ||
                (typeof error.response?.data === "string" ? error.response.data : "Something went wrong");

            return {
                data: error.response?.data || (null as unknown as R), // Preserve response data even on error
                status: status,
                error: { state: true, message: errorMessage },
            };
        }

        // Handle non-Axios errors (e.g., network issues, unexpected exceptions)
        return {
            data: null as unknown as R,
            status: 500,
            error: { state: true, message: "An unexpected error occurred" },
        };
    }
}



