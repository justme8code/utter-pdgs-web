// app/ui/production/TransferList.tsx (Assuming path)
'use client'; // Make sure it's a client component if using hooks

import {useCallback, useEffect, useState} from "react"; // Added useState for loading/error
import {PurchaseTransfer} from "@/app/types";
import {fetchPurchaseTransfers} from "@/api/purchaseTransfer";
import {TransferCard} from "./TransferCard"; // Assuming path
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseTransferStore} from "@/app/store/PurchaseTransferStore";
import {Inbox, Info, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

export const TransferList = () => {
    const {selectedProduction} = useProductionStore();
    const {purchaseTransfers, setPurchaseTransfers} = usePurchaseTransferStore();
    const [isLoading, setIsLoading] = useState(true); // Local loading state for this list
    const [error, setError] = useState<string | null>(null);

    const handleFetchTransfers = useCallback(async () => {
        if (selectedProduction?.id) {
            setIsLoading(true);
            setError(null);
            try {
                const {data, status, error: apiError} = await fetchPurchaseTransfers(); // Assuming fetch returns error prop
                if (data && status) {
                    // Filter out transfers originating from the current selected production
                    setPurchaseTransfers(data.filter(value => value.fromProductionId !== selectedProduction?.id));
                } else {
                    setError(apiError?.message || "Failed to fetch available balances.");
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "An unexpected error occurred while fetching balances.");
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setPurchaseTransfers([]); // Clear if no production selected
            setIsLoading(false);
        }
    }, [selectedProduction?.id, setPurchaseTransfers]);

    useEffect(() => {
        handleFetchTransfers();
    }, [handleFetchTransfers]); // Runs when selectedProduction.id changes

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="mt-2 text-sm">Loading available balances...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-destructive">
                <Info className="h-8 w-8 mb-2"/>
                <p className="text-sm font-medium">Error Loading Balances</p>
                <p className="text-xs text-center">{error}</p>
                <Button variant="outline" size="sm" onClick={handleFetchTransfers} className="mt-3">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {purchaseTransfers.length > 0 ? (
                purchaseTransfers.map((transfer: PurchaseTransfer, index) => (
                    <TransferCard key={transfer.id || index} transfer={transfer}/> // Use transfer.id if available
                ))
            ) : (
                <div
                    className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                    <Inbox className="h-10 w-10 mb-3 text-muted-foreground/70"/>
                    <p className="text-sm font-medium">No Balances Available</p>
                    <p className="text-xs">There are currently no transferable balances from other productions.</p>
                </div>
            )}
        </div>
    );
};