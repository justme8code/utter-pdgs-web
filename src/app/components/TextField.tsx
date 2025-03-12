import React from "react";

interface TextFieldProps {
    value: string;
    label?: string;
    type?: string;
    onChange: (value: string) => void;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const TextField: React.FC<TextFieldProps> = ({ value, label, type = "text", onChange, props }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className={"font-bold"} htmlFor={label}>{label}:</label>}
            <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                type={type}
                id={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...props}
            />
        </div>
    );
};
