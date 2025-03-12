'use server';
import {redirect} from "next/navigation";
import {myRequest} from "@/app/api/axios";
import {createSession, deleteSession} from "../actions";
import {AuthResponse} from "@/app/store/useAuthStore";


const routeTo = "/productions"
const loginRoute = "/login"

export async function login(previousState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === "" || password === "") {
        return { error: "Username or password is required" };
    }
    console.log(email, password);
    // Make the request to the backend

    const {data,status} = await myRequest<FormData,AuthResponse>({
            method: "POST",
            headers: {"Content-Type": "multipart/form-data"},
            url: `/auth`,
            data:formData
    })

    if(data.jwtToken && status === 200) {
        await createSession(data.jwtToken);
        console.log(data);
        return {data,status}
    }else{
        redirect(loginRoute);
    }
}

export async function handleLogout() {
    await deleteSession();
    redirect(loginRoute);
}