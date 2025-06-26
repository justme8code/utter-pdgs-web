// app/productions/prod_components/conversion/ConversionTable.tsx
'use client';
import {useConversionStore} from "@/app/store/conversionStore";
import {CComponent} from "./CComponent"; // Adjusted path
import {ProductMixPage} from "@/app/my_components/production/productMix/ProductMixPage"; // Assuming path is correct
import {useProductionStore} from "@/app/store/productionStore";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Info, Layers, Zap} from 'lucide-react';
import {useProductStore} from "@/app/store/productStore";
import {useEffect} from "react"; // Icons

export function ConversionTable() {
    const {conversions} = useConversionStore();
    const {selectedProduction} = useProductionStore();
    const {products, fetchProducts} = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6"/>
                    Material Conversions
                </CardTitle>
                <CardDescription>
                    Details of raw materials converted into ingredients for production.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {selectedProduction && selectedProduction.id && !selectedProduction.finalized && (
                    // ProductMixPage might need styling or to be wrapped in its own sub-card if complex
                    <div className="border p-4 rounded-md bg-muted/50">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary"/>
                            Product Mix
                        </h3>
                        {products.length > 0 ? <ProductMixPage/> :
                            <p className={"text-red-500 font-medium"}>{"Please create a product template, to mix."}</p>}

                    </div>
                )}

                {conversions.length > 0 ? (
                    <div className="space-y-5 max-h-[700px] overflow-y-auto p-1 custom-scrollbar">
                        {conversions
                            .slice() // make a copy so we don't mutate original array
                            .sort((a, b) => {
                                if (a.batch < b.batch) return -1;
                                if (a.batch > b.batch) return 1;
                                return 0;
                            })
                            .map((conversion, index) => (
                                <CComponent key={conversion.id || index} conversion={conversion}/>
                            ))}
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <Info className="h-10 w-10 text-muted-foreground mb-3"/>
                        <p className="text-lg font-medium text-muted-foreground">No Conversions Recorded</p>
                        <p className="text-sm text-muted-foreground">Purchased materials will appear here once
                            converted.</p>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}