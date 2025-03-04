import React, { useState } from 'react';
import {TextField} from "@/app/components/TextField";
import {Button} from "@/app/components/Button";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Add your authentication logic here
    };

    return (
        <div className={"flex justify-center border-1 border-gray-200 items-center p-6 w-full max-w-md"}>
            <form onSubmit={handleSubmit}  className={"flex flex-col gap-10 w-full"}>
                <div className={"flex justify-center"}>
                    <h1 className={"font-bold text-3xl"}>UtterPGDS</h1>
                    <h1 className={"text-2xl"}>|</h1>
                    <h1 className={"text-2xl"}>Login</h1>
                </div>
                <TextField value={email} label={"Gmail"} onChange={value => setEmail(value)}
                           props={{required: true, type: "email",placeholder:"Enter your email"}
                }/>

                <TextField value={password} label={"Password"} onChange={value => setPassword(value)}
                           props={{required: true, type: "password",placeholder:"Enter your password"}
                           }/>
                <Button label={"Login"} type={"submit"} variant={"primary"} onClick={() => {

                }}/>
            </form>
        </div>
    );
};

export default Login;