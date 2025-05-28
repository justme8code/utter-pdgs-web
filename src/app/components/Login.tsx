import React, {useActionState, useState} from "react";
import {TextField} from "@/app/components/TextField";
import {Button} from "@/app/components/Button";
import LoadingWrapper from "@/app/components/LoadingWrapper";
import {useRouter} from "next/navigation";
import {login} from "@/app/actions/login";
import useAuthStore, {AuthResponse, UserRole} from "@/app/store/useAuthStore";
import Image from "next/image";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setAuth } = useAuthStore(); // Zustand function to set auth state


    const [error, action, isPending] = useActionState(loginUser, undefined);

    async function loginUser(previousState: unknown, formData: FormData) {
        const { data, status,error } = await login(previousState, formData);

        if (status === 200) {
            console.log("Raw Data:", data);

            // Ensure roles match the expected structure
            const formattedRoles: UserRole[] = data.user.roles.map((role: UserRole) => ({
                id: role.id,
                userRole: role.userRole
            }));

            // Update the auth object with correctly typed roles
            const updatedAuth: AuthResponse = {
                ...data,
                user: {
                    ...data.user,
                    roles: formattedRoles
                }
            };

            console.log("Processed Data:", updatedAuth);
            setAuth(updatedAuth); // Save auth state
            router.push("/productions"); // Redirect after login
        } else {
            console.error("Login failed:",error);
        }
    }

    return (

            <div className="flex justify-center border-1 border-gray-200 items-center p-6 w-full max-w-md">
                <LoadingWrapper isLoading={isPending}>
                    <form action={action} className="flex flex-col gap-4 w-full">
                        <div className={"flex justify-center w-full"}>
                            <Image alt={"logo"} src={"/logo.png"} width={100} height={100}/>
                        </div>
                        {error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        ) : null}
                        <div className="flex justify-center">
                            <h1 className="font-bold text-xl">PDGS</h1>
                            <h1 className="text-xl">|</h1>
                            <h1 className="text-xl">Login</h1>
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
                </LoadingWrapper>
            </div>
    );
};

export default Login;
