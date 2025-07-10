// FILE: @/components/production/NewConversionModal.tsx

'use client';

// Add useEffect to your React import
import React, { useState, useEffect } from 'react';
import { Conversion, ConversionField, Purchase } from '@/app/types';
import { getIngredientsByRawmaterialId } from '@/api/inventory';
import { createConversion } from "@/api/conversion";

// Zustand Stores
import { useProductionStore } from "@/app/store/productionStore";
import { usePurchaseStore } from "@/app/store/purchaseStore";
import { useLoadingUI } from "@/app/store/useLoadingUI";
import { useConversionBatchStore } from "@/app/store/conversionBatchStore";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Other Imports
import { toast } from "sonner";
import LoadingWrapper from "@/app/my_components/LoadingWrapper";
import { NewEditableConversionRow } from './NewEditableConversionRow';

// Helper function remains the same
function assignDefaultsToNumberFields(obj: ConversionField, excludeKeys: (keyof ConversionField)[] = []) {
    for (const key of Object.keys(obj) as (keyof ConversionField)[]) {
        if (excludeKeys.includes(key) || key === "ingredient") continue;
        const value = obj[key];
        const numericValue = typeof value === "string" ? parseFloat(value) : value;
        if (typeof numericValue !== "number" || isNaN(numericValue)) {
            obj[key] = 0 as never;
        }
    }
}

type NewConversionModalProps = {
    purchase: Purchase;
};

export const NewConversionModal: React.FC<NewConversionModalProps> = ({ purchase: row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState<string | null>(null);
    const [conversion, setConversion] = useState<Conversion>({
        id: null, productionId: 0, purchaseId: 0, fields: [],
    });

    // Zustand hooks (no changes here)
    const { updatePurchase } = usePurchaseStore();
    const { loading, setLoading } = useLoadingUI();
    const { selectedProduction, setSelectedProduction } = useProductionStore();
    const { addConversionToBatch } = useConversionBatchStore();

    // Button state logic (no changes here)
    const purchaseUsableLeft = row.purchaseUsage?.usableWeightLeft;
    const isFinalized = !!selectedProduction?.finalized;
    const isInvalidWeight = purchaseUsableLeft === undefined || isNaN(purchaseUsableLeft);
    const isZeroWeight = purchaseUsableLeft === 0;
    const isDisabled = isFinalized || isInvalidWeight || isZeroWeight;
    const buttonText = isDisabled ? "Used" : "Convert";

    // --- NEW: Centralized Validation Logic with useEffect ---
    useEffect(() => {
        // This effect runs whenever the conversion fields change, keeping validation in sync.
        const fields = conversion.fields;
        if (!fields || fields.length === 0) {
            // This handles the initial state before fields are loaded
            setInvalidMessage(null); // Or a specific message if you prefer
            return;
        }

        const usableWeight = row.purchaseUsage?.usableWeightLeft ?? 0;

        // Check 1: Total weight exceeds available weight
        const sumOfTotalKgUsed = fields.reduce((acc, curr) => acc + (Number(curr.kgUsed) || 0), 0);
        if (sumOfTotalKgUsed > usableWeight) {
            setInvalidMessage(`Total used (${sumOfTotalKgUsed.toFixed(2)}kg) exceeds available weight (${usableWeight.toFixed(2)}kg).`);
            return; // Exit early, this error has priority
        }

        // Check 2: No input has been provided (all kgUsed are 0 or empty)
        const isAnyInputProvided = fields.some(field => Number(field.kgUsed) > 0);
        if (sumOfTotalKgUsed > 0 && !isAnyInputProvided) { // Check only if user has started typing
            setInvalidMessage("At least one ingredient must have a 'Kg Used' value greater than 0.");
            return;
        }

        // If all checks pass, the form is valid
        setInvalidMessage(null);

    }, [conversion.fields, row.purchaseUsage?.usableWeightLeft]);


    // --- State Reset and Data Loading (no changes) ---
    const resetState = () => {
        setInvalidMessage(null);
        setConversion({ id: null, productionId: 0, purchaseId: 0, fields: [] });
    };

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open && row.rawMaterial?.id) {
            setLoading(true);
            const { data, status } = await getIngredientsByRawmaterialId(row.rawMaterial.id);
            if (status && data) {
                const initialFields: ConversionField[] = data.map((ingredient) => ({
                    id: null, kgUsed: undefined, usableLitres: undefined, outPutLitres: undefined,
                    productionLitresLost: undefined, costPerLitre: undefined, rawBrix: undefined,
                    litresPerKg: undefined, ingredient: ingredient,
                }));
                setConversion({
                    id: null, productionId: 0, purchaseId: row.id ?? 0, fields: initialFields,
                });
            } else {
                toast.error("Failed to fetch ingredients.");
                setIsOpen(false);
            }
            setLoading(false);
        } else if (!open) {
            resetState();
        }
    };

    // --- SIMPLIFIED: Field Update Logic ---
    const handleFieldChange = (ingredientId: number, updatedField: ConversionField) => {
        // This function now only has to update the state. The useEffect will handle validation.
        setConversion(prev => ({
            ...prev,
            fields: prev.fields.map(field =>
                field.ingredient?.id === ingredientId ? updatedField : field
            ),
        }));
    };

    // --- UPDATED: Save Logic with Safeguard ---
    const handleSave = async () => {
        // First, check the existing invalidMessage state.
        if (invalidMessage) {
            toast.error(invalidMessage);
            return;
        }

        // Second, add a final explicit check as a safeguard.
        const isAnyInputProvided = conversion.fields.some(field => Number(field.kgUsed) > 0);
        if (!isAnyInputProvided) {
            toast.error("Cannot save. At least one ingredient must have a 'Kg Used' value greater than 0.");
            return; // Prevent API call
        }

        // Sanitize data before sending
        const fieldsToSave = conversion.fields;
        fieldsToSave.forEach(field => assignDefaultsToNumberFields(field, ["ingredient"]));
        const conversionToSave = {...conversion, fields: fieldsToSave};


        setLoading(true);
        if (selectedProduction?.id && row.id) {
            const { data, status, message } = await createConversion(selectedProduction.id, row.id, conversionToSave);
            if (status && data) {
                toast.success(message);
                setSelectedProduction({ ...selectedProduction, productionStore: data.conversion.productionStore });
                addConversionToBatch(data.productionBatch.id, data.conversion.conversion);
                if (data.conversion.purchase?.id) {
                    updatePurchase(data.conversion.purchase);
                }
                handleOpenChange(false);
            } else {
                toast.error(message);
            }
        }
        setLoading(false);
    };

    // --- Render Header (no changes) ---
    const renderHeader = () => (
        <div className="grid grid-cols-8 gap-3 px-1 py-2 font-semibold text-sm text-muted-foreground">
            <p className="text-center">Ingredient</p>
            <p className="text-center">Kg Used</p>
            <p className="text-center">Output Litres</p>
            <p className="text-center">Litres Lost</p>
            <p className="text-center">Usable Litres</p>
            <p className="text-center">Litres/Kg</p>
            <p className="text-center">Cost/Litre</p>
            <p className="text-center">Raw Brix</p>
        </div>
    );

    // --- UPDATED: Determine if save button should be disabled ---
    // The button should be disabled if there's an error message OR if there's no valid input yet.
    const isSaveDisabled = loading || !!invalidMessage || !conversion.fields.some(field => Number(field.kgUsed) > 0);


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button disabled={isDisabled} title={`Usable Left: ${Number(purchaseUsableLeft).toFixed(2)}kg`}>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create Conversion</DialogTitle>
                    <DialogDescription>
                        Convert raw material into ingredients. Available: {Number(purchaseUsableLeft).toFixed(2)}kg of {row.rawMaterial?.name}.
                    </DialogDescription>
                </DialogHeader>

                <LoadingWrapper isLoading={loading}>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                        {renderHeader()}
                        {conversion.fields.map(field =>
                            field.ingredient?.id ? (
                                <NewEditableConversionRow
                                    key={field.ingredient.id}
                                    ingredient={field.ingredient}
                                    purchase={row}
                                    fieldData={field}
                                    onFieldChange={handleFieldChange}
                                />
                            ) : null
                        )}
                    </div>
                </LoadingWrapper>

                <DialogFooter className="mt-4">
                    <div className="flex-grow text-red-500 font-medium">
                        {invalidMessage && <p>{invalidMessage}</p>}
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                    >
                        {loading ? "Saving..." : "Save Conversion"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};