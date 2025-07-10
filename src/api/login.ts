'use server';
import {redirect} from "next/navigation";
import {myRequest} from "@/lib/axios";
import {createSession, deleteSession} from "@/lib/session";
import {AuthResponse} from "@/app/store/useAuthStore";

const loginRoute = "/login"

export async function login(previousState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === "" || password === "") {
        return {error: "Username or password is required"};
    }
    console.log(email, password);
    // Make the request to the backend

    const {data, status, error} = await myRequest<FormData, AuthResponse>({
        method: "POST",
        headers: {"Content-Type": "multipart/form-data"},
        url: `/auth`,
        data: formData
    });

    if (data && data.jwtToken && status === 200) {
        await createSession(data.jwtToken);
        console.log(error);
        return {data, status}
    } else {
        return {error: error.message};
    }
}

export async function handleLogout() {
    await deleteSession();
    redirect(loginRoute);
}