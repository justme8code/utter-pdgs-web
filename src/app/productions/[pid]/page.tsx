// app/productions/[pid]/page.tsx (assuming this is the file name)
import { fetchProductionFullData } from "@/app/actions/production";

import {AlertTriangle } from "lucide-react";
import ProductionPageClient from "@/app/productions/[pid]/ProductionPageClient";

export default async function ProductionPage({ params }: { params: { pid: number } }) { // Corrected Promise<{pid:number}> to {pid:number} as params is the resolved object
    // const { pid } = await params; // No 'await' needed if params is not a Promise
    const { pid } = params;
    const { data, status } = await fetchProductionFullData(pid);

    if (!status || !data) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center p-6 bg-muted">
                <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-semibold text-destructive mb-2">Failed to Load Production</h1>
                <p className="text-muted-foreground">
                    Could not fetch data for Production ID: {pid}.
                    <br />
                    Please ensure the ID is correct or try again later.
                </p>
            </div>
        );
    }

    return <ProductionPageClient productionData={data} />;
}