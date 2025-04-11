'use client';
import FormBuilder from "@/app/custom-forms/FormBuilder";
import {z} from "zod";
import {TextField2} from "@/app/components/TextField2";
import {useState} from "react";
const loginSchema = z.object({
    email:z.string().email("Please enter a valid email"),
    password: z.string().min(6,"Password must be at least 6 characters long")
})

const fields = [
    { name: "email", label: "Email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password" },
];

export default function CustomHookForms() {
    const [email, setEmail] = useState("");
    return (
        <div>
            <h1>Custom Hooks Form</h1>
            <FormBuilder schema={loginSchema} fields={fields}/>
            <TextField2  value={email} placeholder={"input something"} onChange={value => {
                setEmail(value);
            }}/>
            {email}
        </div>
    )
}
