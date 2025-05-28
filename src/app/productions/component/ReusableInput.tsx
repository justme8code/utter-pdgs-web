import React from "react";
import {UseFormRegister, FieldError, FieldValues, Path} from "react-hook-form";

interface ReusableInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: string;
    value?: T[keyof T];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    disabled?: boolean;
    min?: number;
}

const ReusableInput = <T extends FieldValues,>({
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
                           }: ReusableInputProps<T>) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
                {...register(name, {
                    required: error ? `${label} is required.` : undefined,
                    min: min !== undefined ? { value: min, message: `${label} cannot be less than ${min}.` } : undefined,
                })}
                type={type}
                name={String(name)}
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
