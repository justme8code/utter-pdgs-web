import Link from "next/link";
import React from "react";


interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger"|"none";
    disabled?: boolean;
    href?: string; // If provided, renders as a link instead of a button
    external?: boolean; // Determines if it's an external link
    className?: string;
    props?: React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
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
                                                  className,
                                                  icon,
                                                  iconPosition = "left",
                                              }) => {
    const baseStyles = `px-4 py-2 rounded-md font-medium transition-all duration-300 inline-flex items-center justify-center gap-2`;
    const variantStyles = {
        primary: `bg-blue-500 text-white hover:opacity-90 hover:brightness-95`,
        secondary: `bg-gray-500 text-white hover:opacity-90 hover:brightness-95`,
        danger: `bg-red-500 text-white hover:opacity-90 hover:brightness-95`,
        none: `hover:opacity-90 hover:brightness-95`,
    };


    const content = (
        <>
            {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
            <span>{label}</span>
            {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </>
    );

    const finalClass = `${baseStyles} ${variantStyles[variant]} ${
        disabled ? "opacity-20 cursor-not-allowed" : ""
    } ${className}`;

    if (href) {
        return external ? (
            <a
                href={href}
                className={finalClass}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {content}
            </a>
        ) : (
            <Link href={href} className={finalClass} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={`${finalClass} `}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {content}
        </button>
    );
};
