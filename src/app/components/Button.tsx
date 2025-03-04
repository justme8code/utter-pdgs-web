import Link from "next/link";
import React from "react";


interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    href?: string; // If provided, renders as a link instead of a button
    external?: boolean; // Determines if it's an external link
    props?: React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

export const Button: React.FC<ButtonProps> = ({
                                                  label,
                                                  onClick,
                                                  type = "button",
                                                  variant = "primary",
                                                  disabled = false,
                                                  href,
                                                  external = false,
                                                  props,
                                              }) => {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition duration-200 inline-flex items-center justify-center";
    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    if (href) {
        return external ? (
            <a
                href={href}
                className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {label}
            </a>
        ) : (
            <Link
                href={href}
                className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                {...props}
            >
                {label}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {label}
        </button>
    );
};
