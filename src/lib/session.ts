import 'server-only';

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {AxiosRequestConfig} from "axios";
import {myRequest, ResponseModel} from "@/lib/axios";


const COOKIE_NAME = "jwt_token";

export async function createSession(token: string) {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,         // Prevents JS access to the cookie
        secure: true,  // Ensures cookie is sent only over HTTPS in production
        path: '/',              // Cookie is available to the entire site
        sameSite: 'none',       // Allows the cookie to be sent with cross-origin requests
        maxAge: 60 * 60 * 24 * 7, // Optional: expires in 7 days
    });
}

// This function can be simplified. Its only job is to get the token.
// The caller should decide what to do if the token is missing.
export async function getSessionToken(): Promise<string | undefined> {
    const cookieStore = cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteSession() {
    cookies().delete(COOKIE_NAME);
    redirect("/login");
}

export async function makeAuthRequest<T, R>(
    options: AxiosRequestConfig & { data?: T }
): Promise<ResponseModel<R>> {
    const token = await getSessionToken(); // Fetch the session token


    // If there's no token at all, we can short-circuit and redirect immediately.
    if (!token) {
        redirect('/login');
    }

    // Ensure headers are properly set without overriding defaults
    const headers = {
        ...(options.headers ?? {}), // Preserve any existing headers
        ...(token ? {Authorization: `Bearer ${token}`} : {}), // Add Authorization only if token exists
        Accept: "application/json", // Ensure JSON is accepted
    };

    // Make the request. The backend will do the real verification.
    const response = await myRequest<T, R>({...options, headers});

    // Handle the 401 Unauthorized case
    // Your `myRequest` (axios instance) should be configured to NOT throw on 401.
    if (response.status === 401) {
        // The backend told us the token is invalid or expired.
        // Now is the time to act.
        await deleteSession(); // This will clear the bad cookie and redirect.
        // We need to stop execution here. We can throw an error that will be caught by a boundary.
        throw new Error("Session expired or invalid.");
    }

    return response;
}

