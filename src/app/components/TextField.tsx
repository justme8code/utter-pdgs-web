import React from "react";

interface TextFieldProps {
    value?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    onChange?: (value: string) => void;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
    defaultValue?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ value, name,label, placeholder, required,type = "text", onChange, props,defaultValue }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className={"font-bold"} htmlFor={label}>{label}:</label>}
            <input
                name={name}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                type={type}
                required={required}
                id={label}
                value={value}
                onChange={(e) => onChange ? onChange(e.target.value) :undefined}
                {...props}
                defaultValue={defaultValue}
            />
        </div>
    );
};
