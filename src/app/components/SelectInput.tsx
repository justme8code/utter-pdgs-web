import React from "react";

type SelectInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    placeholder: string;
    children?:React.ReactNode;
};

const SelectInput: React.FC<SelectInputProps> = ({ value, onChange, options, placeholder,children }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className="p-2 border rounded-md"
        >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default SelectInput;