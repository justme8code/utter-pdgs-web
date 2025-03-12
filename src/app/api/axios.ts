import axios, { AxiosRequestConfig} from "axios";
import { BASE_URL } from "@/app/api/urls";

const axiosInstance = axios.create({
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

        return {
            data: null as unknown as R, // Ensure type safety
            status: error.response?.status || 500,
            error: { state: true, message: error.response?.data?.message || "Something went wrong" },
        };
    }
}
