import {ReactNode} from "react";

interface LoadingProps {
    isLoading: boolean;
    children?: ReactNode;
    className?: string;
}

export default function LoadingWrapper({isLoading, children, className}: LoadingProps) {
    // Check if className includes "relative"
    const isRelative = className?.includes("relative");

    return (
        <div className={`w-full ${className ?? ""}`}>
            {isLoading && (
                <div
                    className={`
            ${isRelative ? "absolute inset-0" : "fixed inset-0"} 
            z-50 bg-white/50 flex items-center justify-center
          `}
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"/>
                        <h1>please wait...</h1>
                    </div>
                </div>
            )}
            {children}
        </div>
    );
}


