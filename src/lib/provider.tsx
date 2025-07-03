'use client';
import {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {Toaster as SonnerToaster} from "@/components/ui/sonner";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (

    <QueryClientProvider client={queryClient}>

        <SonnerToaster richColors position="top-right"/>
        {children}

        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

);
}