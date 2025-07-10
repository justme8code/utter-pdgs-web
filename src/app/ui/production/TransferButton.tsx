// app/ui/production/TransferButton.tsx
'use client';

import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore"; // Your original store
import {useLoadingUI} from "@/app/store/useLoadingUI";
import {createPurchaseTransfer} from "@/api/purchaseTransfer";
import {usePurchaseTransferStore} from "@/app/store/PurchaseTransferStore";

import {Button as ShadcnButton} from "@/components/ui/button";
import {Loader2, Shuffle} from "lucide-react";
import {useCallback, useState} from "react";

interface TransferButtonProps {
    purchaseToTransferId: number; // Assuming this is the ID of the PurchaseTransfer record or source Purchase ID
    onTransferSuccess?: () => void;
    onTransferError?: (message: string) => void;
}

export const TransferButton = ({purchaseToTransferId, onTransferSuccess, onTransferError}: TransferButtonProps) => {
    const selectedProduction = useProductionStore((state) => state.selectedProduction);

    // --- THIS IS THE KEY CHANGE: Revert to your original store access ---
    const {purchases, setPurchases} = usePurchaseStore();
    // --- END KEY CHANGE ---

    const removePurchaseTransfer = usePurchaseTransferStore((state) => state.removePurchaseTransfer);
    const {loading: globalLoading, setLoading: setGlobalLoading, setSuccessMessage} = useLoadingUI();

    const [isTransferring, setIsTransferring] = useState(false);

    const handleCreateTransfer = useCallback(async () => {
        if (!selectedProduction?.id) {
            setSuccessMessage("No production selected to transfer to.", false);
            return;
        }
        if (!purchaseToTransferId) {
            setSuccessMessage("Invalid item selected for transfer.", false);
            return;
        }

        setIsTransferring(true);
        setGlobalLoading(true); // Set global loading as your original logic did

        try {
            const response = await createPurchaseTransfer(
                selectedProduction.id,
                purchaseToTransferId
            );

            // Assuming response structure: { data: { purchase: Purchase, purchaseTransfer: { id: number } }, message: string, status: boolean, error?: { message: string } }
            if (response.status && response.data) {
                // --- THIS IS THE KEY CHANGE: Use setPurchases directly ---
                if (response.data.purchase) { // Ensure purchase exists in response
                    setPurchases([response.data.purchase, ...purchases]);
                } else {
                    console.warn("Transfer response did not include 'purchase' data for the current production.");
                }
                // --- END KEY CHANGE ---

                if (response.data.purchaseTransfer) {
                    removePurchaseTransfer(response.data.purchaseTransfer.id);
                } else {
                    console.warn("Transfer response did not include 'purchaseTransfer.id' or it was invalid.");
                    // Fallback if purchaseTransfer.id is not what removePurchaseTransfer expects:
                    // perhaps removePurchaseTransfer should take purchaseToTransferId if that's the ID of the item in the list
                    // removePurchaseTransfer(purchaseToTransferId);
                }

                setSuccessMessage(response.message || "Transfer completed successfully!", true);
                if (onTransferSuccess) onTransferSuccess();
            } else {
                const errorMsg = response.message || response.error?.message || "Failed to complete transfer.";
                setSuccessMessage(errorMsg, false);
                if (onTransferError) onTransferError(errorMsg);
            }
        } catch (error: unknown) {
            const errorMsg = "An unexpected error occurred during transfer.";
            setSuccessMessage(errorMsg, false);
            if (onTransferError) onTransferError(errorMsg);
            console.error("Transfer error:", error);
        } finally {
            setIsTransferring(false);
            setGlobalLoading(false); // Reset global loading
        }
    }, [
        selectedProduction,
        purchaseToTransferId,
        purchases,              // Add purchases to dependency array because it's used in setPurchases
        setPurchases,           // Add setPurchases to dependency array
        removePurchaseTransfer,
        setSuccessMessage,
        onTransferSuccess,
        onTransferError,
        setGlobalLoading,
    ]);

    return (
        <ShadcnButton
            onClick={handleCreateTransfer}
            disabled={isTransferring || globalLoading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white"
            size="sm"
        >
            {isTransferring ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            ) : (
                <Shuffle className="mr-2 h-4 w-4"/>
            )}
            {isTransferring ? "Transferring..." : "Transfer to this Production"}
        </ShadcnButton>
    );
};