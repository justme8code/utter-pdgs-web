// Type: Server-side
import 'server-only';

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {AxiosRequestConfig} from "axios";
import {myRequest, ResponseModel} from "@/app/api/axios";


const Cookie_Name="jwt_token";

export async function createSession(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(Cookie_Name, token, {
        httpOnly: true,         // Prevents JS access to the cookie
        secure: true,  // Ensures cookie is sent only over HTTPS in production
        path: '/',              // Cookie is available to the entire site
        sameSite: 'none',       // Allows the cookie to be sent with cross-origin requests
        maxAge: 60 * 60 * 24 * 7, // Optional: expires in 7 days
    });
}

export async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(Cookie_Name)?.value;
    if (!token) {
        redirect("/login")
    }
    return token;
}

export async function deleteSession() {
    (await cookies()).delete(Cookie_Name);
    redirect("/login");
}

export async function makeAuthRequest<T, R>(
    options: AxiosRequestConfig & { data?: T }
): Promise<ResponseModel<R>> {
    const token = await verifySession(); // Fetch the session token
    // Ensure headers are properly set without overriding defaults
    const headers = {
        ...(options.headers ?? {}), // Preserve any existing headers
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization only if token exists
        Accept: "application/json", // Ensure JSON is accepted
    };

    return myRequest<T, R>({ ...options, headers });
}

