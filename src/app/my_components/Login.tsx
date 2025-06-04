import React, { useState } from "react"; // Removed useActionState
import { TextField } from "@/app/my_components/TextField";
import { Button } from "@/app/my_components/Button";
import LoadingWrapper from "@/app/my_components/LoadingWrapper";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/login"; // Assuming login is your server action
import useAuthStore, { AuthResponse, UserRole } from "@/app/store/useAuthStore";
import Image from "next/image";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setAuth } = useAuthStore(); // Zustand function to set auth state

    // State for loading and error messages
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setIsPending(true);
        setError(undefined); // Clear previous errors

        // Create FormData to pass to the server action
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            // Call the server action.
            // The 'login' action might expect a 'previousState' argument if it was designed for useActionState.
            // If it doesn't strictly need it when called directly, you can pass null or undefined.
            // Adjust this based on your 'login' action's signature.
            // Let's assume it can handle `null` or `undefined` for `previousState` when not used with `useActionState`.
            const { data, status, error: actionError } = await login(undefined, formData);

            if (status === 200 && data) {
                console.log("Raw Data:", data);

                // Ensure roles match the expected structure
                const formattedRoles: UserRole[] = data.user.roles.map((role: UserRole) => ({ // Use 'any' for incoming role if not strictly typed
                    id: role.id,
                    userRole: role.userRole,
                }));

                // Update the auth object with correctly typed roles
                const updatedAuth: AuthResponse = {
                    ...data,
                    user: {
                        ...data.user,
                        roles: formattedRoles,
                    },
                };

                console.log("Processed Data:", updatedAuth);
                setAuth(updatedAuth); // Save auth state
                router.push("/"); // Redirect after login
            } else {
                const errorMessage = actionError || "Login failed. Please check your credentials.";
                console.error("Login failed:", errorMessage);
                setError(errorMessage);
            }
        } catch (e: unknown) { // Use 'unknown' for better type safety
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (e instanceof Error) {
                errorMessage = e.message;
            } else if (typeof e === 'string') {
                errorMessage = e;
            }
            // It's good to log the actual error object `e` for debugging,
            // especially if it's not an Error instance or a string.
            console.error("An unexpected error occurred during login:", e);
            setError(errorMessage);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex justify-center border-1  bg-white shadow rounded-sm items-center p-6 w-full max-w-md">
            <LoadingWrapper isLoading={isPending}>
                {/* Use onSubmit for the form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div className={"flex justify-center w-full"}>
                        <Image alt={"logo"} src={"/logo.png"} width={100} height={100} />
                    </div>
                    {error ? (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Error! </strong>
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
                    <Button label={"Login"} type={"submit"} variant={"primary"} disabled={isPending} />
                </form>
            </LoadingWrapper>
        </div>
    );
};

export default Login;