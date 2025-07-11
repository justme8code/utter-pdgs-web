import React from "react";
import {ControllerRenderProps, FieldValues, Path} from "react-hook-form";

type TextFieldProps<T extends FieldValues = FieldValues, N extends Path<T> = Path<T>> = {
    value?: string | number;
    name?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    onChange?: (value: string) => void;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
    defaultValue?: string;
    className?: string;
    field?: ControllerRenderProps<T, N>;
};

export function TextField2<T extends FieldValues = FieldValues, N extends Path<T> = Path<T>>({
                                                                                                 name,
                                                                                                 label,
                                                                                                 placeholder,
                                                                                                 required,
                                                                                                 type = "text",
                                                                                                 onChange,
                                                                                                 props,
                                                                                                 className,
                                                                                                 field,
                                                                                                 value,
                                                                                             }: TextFieldProps<T, N>) {
    return (
        <div className={`${label ? "flex w-full flex-col gap-2" : "w-full"} ${className}`}>
            {label && (
                <label className="font-bold" htmlFor={name}>
                    {label}:
                </label>
            )}
            <input
                {...props}
                {...field}
                value={field ? field.value : value}
                name={name}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-xs px-2 py-1 outline-none focus:ring-2 focus:ring-slate-500 focus:border-none"
                type={type}
                required={required}
                id={name}
                onChange={(e) => {
                    field?.onChange(e);
                    onChange?.(e.target.value);
                }}
            />
        </div>
    );
}