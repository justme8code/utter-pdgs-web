import React from "react";
import {ErrorBoundary} from "react-error-boundary";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
    message?: string;
}

const ErrorFallback = ({error, resetErrorBoundary, message}: ErrorFallbackProps) => {
    return (
        <div className="p-4 border border-red-500 bg-red-100 text-red-700 rounded">
            <h2 className="text-lg font-bold">{message || "Something went wrong"}</h2>
            <p>{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Try Again
            </button>
        </div>
    );
};

interface FunctionalErrorBoundaryProps {
    children: React.ReactNode;
    message?: string;
}

const FunctionalErrorBoundary = ({children, message}: FunctionalErrorBoundaryProps) => {
    return (
        <ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} message={message}/>}>
            {children}
        </ErrorBoundary>
    );
};

export default FunctionalErrorBoundary;
