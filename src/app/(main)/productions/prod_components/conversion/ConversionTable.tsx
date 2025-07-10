'use client';

import {CComponent} from "./CComponent";
import {ProductMixPage} from "@/app/my_components/production/productMix/ProductMixPage";
import {useProductionStore} from "@/app/store/productionStore";
import {useProductStore} from "@/app/store/productStore";
import {useConversionBatchStore} from "@/app/store/conversionBatchStore";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {ChevronDown, ChevronUp, Info, Layers, Zap} from 'lucide-react';
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useCreateConversionBatch} from "@/app/store/useCreateConversionBatch";
import {toast} from "sonner";

export function ConversionTable() {
    const {conversionBatches} = useConversionBatchStore();
    const {selectedProduction} = useProductionStore();
    const {products, fetchProducts} = useProductStore();
    const createBatchMutation = useCreateConversionBatch(selectedProduction?.id ?? -1);
    const [expandedBatchIds, setExpandedBatchIds] = useState<number[]>([]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const toggleBatch = (id: number) => {
        setExpandedBatchIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleCreateBatch = () => {
        if (!selectedProduction?.id) {
            toast.error("No production selected");
            return;
        }

        createBatchMutation.mutate(undefined, {
            onSuccess: (batch) => {
                toast.success(`Batch "${batch?.name}" created`);
            },
            onError: () => {
                toast.error("Failed to create batch");
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <Zap className="h-6 w-6"/>
                        Material Conversions
                    </div>
                    <Button
                        variant="ghost"
                        disabled={createBatchMutation.isPending}
                        onClick={handleCreateBatch}
                    >
                        <Badge variant="secondary">{conversionBatches.length}</Badge>
                        {createBatchMutation.isPending ? "Creating..." : "Create batch"}
                    </Button>
                </CardTitle>
                <CardDescription>
                    Details of raw materials converted into ingredients for production.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {selectedProduction && selectedProduction.id && !selectedProduction.finalized && (
                    <div className="border p-4 rounded-md bg-muted/50">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary"/>
                            Product Mix
                        </h3>
                        {products.length > 0 ? <ProductMixPage/> : (
                            <p className="text-red-500 font-medium">
                                Please create a product template to mix.
                            </p>
                        )}
                    </div>
                )}

                {conversionBatches.length > 0 ? (
                    <div className="space-y-5 max-h-[700px] overflow-y-auto p-1 custom-scrollbar">
                        {conversionBatches
                            .slice()
                            .sort((a, b) => (a.active === b.active ? a.id - b.id : b.active ? 1 : -1))
                            .map((batch) => {
                                const isExpanded = expandedBatchIds.includes(batch.id);

                                return (
                                    <Card key={batch.id} className="border border-border shadow-sm">
                                        <CardHeader
                                            onClick={() => toggleBatch(batch.id)}
                                            className={`flex flex-row items-center justify-between px-4 py-3 cursor-pointer ${
                                                batch.active
                                                    ? "bg-green-100 border-b border-green-400"
                                                    : "bg-muted/30 border-b"
                                            }`}
                                        >
                                            <CardTitle className="text-base font-semibold text-primary">
                                                {batch.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-3">
                                                {batch.active && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-green-700 border-green-400 bg-green-200"
                                                    >
                                                        Active Batch
                                                    </Badge>
                                                )}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-muted-foreground"/>
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground"/>
                                                )}
                                            </div>
                                        </CardHeader>

                                        {isExpanded && (
                                            <CardContent className="space-y-4 p-4">
                                                {batch.conversions.length > 0 ? (
                                                    batch.conversions.map((conversion, index) => (
                                                        <CComponent key={conversion.id || index}
                                                                    conversion={conversion}/>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">
                                                        No conversions for this batch.
                                                    </p>
                                                )}
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })}
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <Info className="h-10 w-10 text-muted-foreground mb-3"/>
                        <p className="text-lg font-medium text-muted-foreground">
                            No Conversions Recorded
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Purchased materials will appear here once converted.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
