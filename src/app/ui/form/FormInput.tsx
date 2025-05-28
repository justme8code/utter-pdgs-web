import { Field, Label, Input } from '@headlessui/react';
import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type FormInputProps<TFormValues extends FieldValues> = {
    label: string;
    name: Path<TFormValues>;
    type?: string;
    register: UseFormRegister<TFormValues>;
    asNumber?:boolean;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput = <TFormValues extends FieldValues>({
                                                               label,
                                                               name,
                                                               type = 'text',
                                                               register,
                                                               error,
                                                               asNumber=false,
                                                               ...props
                                                           }: FormInputProps<TFormValues>) => {
    return (
        <div className="w-full">
            <Field>
                <Label className="text-sm/6 font-medium">{label}</Label>
                <Input
                    {...register(name,{
                        valueAsNumber: asNumber
                    })}
                    type={type}
                    step={asNumber ? "any" : undefined}
                    {...props}
                    className={"border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-"}
                />
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </Field>
        </div>
    );
};
