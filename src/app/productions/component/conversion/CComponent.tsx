// app/productions/component/conversion/CComponent.tsx
import { Conversion, Purchase } from "@/app/types";
import React, { useEffect, useState } from "react";
import { ReadonlyConversion } from "./ReadOnlyConversion"; // Adjusted path
import { usePurchaseStore } from "@/app/store/purchaseStore";
import { beautifyDate } from "@/app/utils/functions";
import { Separator } from "@/components/ui/separator"; // Shadcn Separator
import { Package, Tag, CalendarDays, Clock, Hash, Box } from "lucide-react"; // Icons

export const CComponent = ({ conversion }: { conversion: Conversion }) => {
    const { getPurchase } = usePurchaseStore();
    const [purchase, setPurchase] = useState<Purchase | undefined>(); // Initialize as undefined

    useEffect(() => {
        if (!conversion.purchaseId) return;
        const fetchedPurchase = getPurchase(conversion.purchaseId);
        setPurchase(fetchedPurchase);
    }, [conversion.purchaseId, getPurchase]); // Removed 'purchase' from deps to avoid loop

    const ReadOnlyInput = ({ label, value, icon: Icon }: { label: string, value: string | number | undefined, icon?: React.ElementType }) => (
        <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-muted-foreground mb-1 items-center">
                {Icon && <Icon className="h-3.5 w-3.5 mr-1" />}
                {label}
            </label>
            <input
                readOnly={true}
                value={value ?? "N/A"}
                className="w-full p-2 h-9 text-sm bg-muted border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
    );

    return (
        <div className="bg-card border rounded-lg shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap justify-between items-center text-xs text-muted-foreground gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Date: {beautifyDate(conversion.createdAt ?? "").formatted}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>({beautifyDate(conversion.createdAt ?? "").relative})</span>
                </div>
                <div className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Batch: <span className="font-semibold text-foreground">{`BN-${conversion.batch}`}</span></span>
                </div>
            </div>

            <Separator />

            {purchase && purchase.id ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <ReadOnlyInput label="Raw Material" value={purchase.rawMaterial?.name} icon={Package} />
                        <ReadOnlyInput label="Total Usable" value={`${purchase.usableWeight} kg`} icon={Box} />
                        <ReadOnlyInput label="Purchase ID" value={purchase.id} icon={Hash} />
                        {/* Batch already shown above, can remove this if redundant or keep for detail */}
                        {/* <ReadOnlyInput label="Batch (from Conversion)" value={`BN-${conversion.batch}`} icon={Tag} /> */}
                    </div>

                    {conversion.fields && conversion.fields.some(field => !isNaN(parseFloat(String(field.kgUsed))) && field.kgUsed !== 0.0) && (
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Converted Ingredients:</h4>
                            <div className="flex flex-wrap gap-3">
                                {conversion.fields.map((field, index) => (
                                    !isNaN(parseFloat(String(field.kgUsed))) && field.kgUsed !== 0.0
                                        ? <ReadonlyConversion key={field.ingredient?.id || index} field={field} showLabel={index === 0} />
                                        : null
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic">Loading purchase details or purchase not found...</p>
            )}
        </div>
    );
};