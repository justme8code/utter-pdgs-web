import React, { useActionState, useState } from "react";
import { TextField } from "@/app/components/TextField";
import { Button } from "@/app/components/Button";
import LoadingWrapper from "@/app/components/LoadingWrapper";
import { useRouter } from "next/navigation";
import { login } from "@/app/login/actions";
import useAuthStore from "@/app/store/useAuthStore";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setAuth } = useAuthStore(); // Zustand function to set auth state
    const [error, action, isPending] = useActionState(loginUser, undefined);

    async function loginUser(previousState: unknown, formData: FormData) {
        const { data, status } = await login(previousState, formData);
        if (status === 200) {
            console.log(data);
            setAuth(data); // Save auth state
            router.push("/productions"); // Redirect after login
        }
    }

    return (
        <LoadingWrapper isLoading={isPending}>
            <div className="flex justify-center border-1 border-gray-200 items-center p-6 w-full max-w-md">
                <form action={action} className="flex flex-col gap-10 w-full">
                    <div className="flex justify-center">
                        <h1 className="font-bold text-3xl">UtterPDGS</h1>
                        <h1 className="text-2xl">|</h1>
                        <h1 className="text-2xl">Login</h1>
                    </div>
                    <TextField
                        value={email}
                        label={"Gmail"}
                        onChange={(value) => setEmail(value)}
                        props={{ name: "email", required: true, type: "email", placeholder: "Enter your email" }}
                    />
                    <TextField
                        value={password}
                        label={"Password"}
                        onChange={(value) => setPassword(value)}
                        props={{ name: "password", required: true, type: "password", placeholder: "Enter your password" }}
                    />
                    <Button label={"Login"} type={"submit"} variant={"primary"} />
                </form>
            </div>
        </LoadingWrapper>
    );
};

export default Login;
