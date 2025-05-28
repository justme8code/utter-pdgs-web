import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface ReusableInputProps {
    label: string;
    name: string;
    register: UseFormRegister<any>; // Adjust 'any' to your form type if known
    error?: FieldError;
    type?: string;
    value?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    disabled?: boolean;
    min?: number;
}

const ReusableInput = ({
                           label,
                           name,
                           register,
                           error,
                           type = "text",
                           value,
                           onChange,
                           readOnly = false,
                           disabled = false,
                           min,
                       }: ReusableInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
                {...register(name, {
                    required: error ? `${label} is required.` : undefined,
                    min: min !== undefined ? { value: min, message: `${label} cannot be less than ${min}.` } : undefined,
                })}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
            />
            {error && (
                <div className="text-red-500 text-sm mt-1">
                    <p>{String(error?.message)}</p>
                </div>
            )}
        </div>
    );
};

export default ReusableInput;