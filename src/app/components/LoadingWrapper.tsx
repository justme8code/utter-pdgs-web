import { ReactNode } from "react";

interface LoadingProps {
    isLoading: boolean;
    children: ReactNode;
}

export default function LoadingWrapper({ isLoading, children }: LoadingProps) {
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
            </div>
        );
    }
    return <>{children}</>;
}
