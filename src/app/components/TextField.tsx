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
    className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ value, name,label, placeholder, required,type = "text", onChange, props,defaultValue,className }) => {
    return (
        <div className={`${ label ? "flex w-full flex-col gap-2" :"w-full"}  ${className}`}>
            {label && <label className={"font-bold"} htmlFor={label}>{label}:</label>}
            <input
                name={name}
                placeholder={placeholder}
                className={`w-full border border-gray-300 rounded-xs px-2 py-1 outline-none focus:ring-2 focus:ring-slate-500 focus:border-none focus:outline-none`}
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
