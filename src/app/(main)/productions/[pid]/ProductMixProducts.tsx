'use client'

import {useProductMixOutputStoreStore} from "@/app/store/productMixOutputStore";
import {useCallback, useEffect, useState} from "react";
import {getProductMixOutputs} from "@/api/productMix";
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Beaker, Citrus, Info, Loader2} from 'lucide-react'; // Icons
import {Separator} from "@/components/ui/separator";

export const ProductMixProducts = () => {
    const {productMixOutput, setProductMixOutputs} = useProductMixOutputStoreStore();
    const {selectedProduction} = useProductionStore();
    const {purchases} = usePurchaseStore(); // Only used to trigger fetch

    const [loading, setLoading] = useState(false);

    const handleFetchProductMixOutputs = useCallback(async () => {
        if (!selectedProduction?.id) {
            setProductMixOutputs([]);
            return;
        }
        setLoading(true);
        try {
            const {data, status} = await getProductMixOutputs(selectedProduction.id);
            if (status && data) {
                setProductMixOutputs(data);
            } else {
                setProductMixOutputs([]);
            }
        } catch (error) {
            console.error("Error fetching product mix outputs:", error);
            setProductMixOutputs([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProduction?.id, setProductMixOutputs]);

    useEffect(() => {
        // Fetch if there are purchases OR if selectedProduction.id changes
        // This ensures re-fetch if production context changes even if purchases are empty initially
        if (selectedProduction?.id) {
            handleFetchProductMixOutputs();
        } else {
            setProductMixOutputs([]); // Clear if no production selected
        }
    }, [handleFetchProductMixOutputs, selectedProduction?.id, setProductMixOutputs]); // Removed purchases.length as direct trigger


    // Conditionally render the whole card if there are no purchases (or relevant trigger)
    if (purchases.length === 0) { // Or a more relevant condition for when this section should appear
        return null; // Or a placeholder message if appropriate
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Citrus className="h-6 w-6"/>
                    Product Mix Output
                </CardTitle>
                <CardDescription>
                    Final products created from the mixed ingredients.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4"/>
                        <p className="text-lg font-medium">Loading Product Mix Outputs...</p>
                    </div>
                ) : (!productMixOutput || productMixOutput.length === 0) ? (
                    <div
                        className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <Info className="h-10 w-10 text-muted-foreground mb-3"/>
                        <p className="text-lg font-medium text-muted-foreground">No Product Mix Output Found</p>
                        <p className="text-sm text-muted-foreground">Outputs will appear here once product mixes are
                            defined and processed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productMixOutput.map((output) => (
                            <div key={output.id} className="
                                border border-border bg-card rounded-lg shadow-sm p-5
                                hover:shadow-lg transition-shadow duration-200 ease-in-out
                                flex flex-col group space-y-4
                            ">
                                <div className="flex-grow">
                                    <h2 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
                                        {output.product.name} - {output.id}
                                    </h2>
                                    {output.product.description && (
                                        <p className="text-xs text-muted-foreground mt-1 mb-3 min-h-[30px]">
                                            {output.product.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-muted-foreground space-y-1 mb-3">
                                        <p><strong>Unit:</strong> {output.product.unitOfMeasure}</p>
                                        <p><strong>Target Count:</strong> {output.productCount}</p>
                                        <p><strong>Total Liters Used:</strong> {output.totalLitersUsed ?? 'N/A'}</p>
                                    </div>

                                    <Separator className="my-3"/>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                        <p><strong>Initial Brix:</strong> {output.initialBrix ?? '-'}</p>
                                        <p><strong>Final Brix:</strong> {output.finalBrix ?? '-'}</p>
                                        <p><strong>Initial pH:</strong> {output.initialPH ?? '-'}</p>
                                        <p><strong>Final pH:</strong> {output.finalPH ?? '-'}</p>
                                        <p className="col-span-2"><strong>Brix on
                                            Diluent:</strong> {output.brixOnDiluent ?? '-'}</p>
                                    </div>
                                </div>

                                {output.productMixIngredients && output.productMixIngredients.length > 0 && (
                                    <div className="mt-4 pt-3 border-t">
                                        <h3 className="text-sm font-semibold mb-1.5 text-foreground flex items-center gap-1.5">
                                            <Beaker className="h-4 w-4 text-primary"/>
                                            Ingredients Used
                                        </h3>
                                        <ul className="text-xs text-muted-foreground space-y-0.5 max-h-28 overflow-y-auto custom-scrollbar pr-1">
                                            {output.productMixIngredients.map((ing) => (
                                                <li key={ing.id ?? ing.ingredientId} className="flex justify-between">
                                                    <span>{ing.ingredient?.name ?? 'Unknown Ingredient'}</span>
                                                    <span className="font-medium">{ing.litresUsed} L</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};