'use client'

import {useProductMixOutputStoreStore} from "@/app/store/productMixOutputStore";
import {useCallback, useEffect, useState} from "react";
import {getProductMixOutputs} from "@/app/actions/productMix";
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";

export const ProductMixProducts = () => {
    const {productMixOutput, setProductMixOutputs} = useProductMixOutputStoreStore();
    const {selectedProduction} = useProductionStore();
    const {purchases} = usePurchaseStore();

    const [loading, setLoading] = useState(false);

    const handleFetchProductMixOutputs = useCallback(async () => {
        setLoading(true);
        if (selectedProduction?.id != null) {
            try {
                const {data, status} = await getProductMixOutputs(selectedProduction.id);
                if (status) {
                    setProductMixOutputs(data);
                } else {
                    setProductMixOutputs([]);
                }
            } catch (error) {
                console.error("Error fetching product mix outputs:", error);
                setProductMixOutputs([]);
            }
        } else {
            setProductMixOutputs([]);
        }
        setLoading(false);
    }, [selectedProduction?.id, setProductMixOutputs]);

    useEffect(() => {
        if (purchases.length > 0) {
            handleFetchProductMixOutputs();
        }
    }, [handleFetchProductMixOutputs, purchases.length]);

    return (
        <>
            {purchases.length > 0 && <div className="relative">
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-gray-500 text-lg font-medium">
                        Loading product mix outputs...
                    </div>
                ) : (!productMixOutput || productMixOutput.length === 0) ? (
                    <p className="text-center mt-10 text-gray-500">No ProductMix output found.</p>
                ) : (
                    <div className={"space-y-5"}>
                        <h1 className={"text-xl font-medium"}>Product Mix Output</h1>
                        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                            {productMixOutput.map((output) => (
                                <div key={output.id} className="
                            border border-gray-200
                            rounded-xl
                            shadow-lg
                            p-6
                            bg-white
                            hover:shadow-2xl
                            max-w-sm
                            transition-shadow
                            duration-300
                            flex
                            flex-col
                            justify-between
                            group">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                                            {output.product.name}
                                        </h2>
                                        <p className="text-gray-600  min-h-[48px]">{output.product.description}</p>
                                        <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
                                            <span><strong>Unit:</strong> {output.product.unitOfMeasure}</span>
                                            <span><strong>Count:</strong> {output.productCount}</span>
                                            <span><strong>Total Liters:</strong> {output.totalLitersUsed ?? 'N/A'}</span>
                                        </div>
                                        <div
                                            className="grid grid-cols-2 gap-3 text-sm text-gray-700 border-t border-gray-100 pt-4">
                                            <div><strong>Initial Brix:</strong> {output.initialBrix ?? '-'}</div>
                                            <div><strong>Final Brix:</strong> {output.finalBrix ?? '-'}</div>
                                            <div><strong>Initial pH:</strong> {output.initialPH ?? '-'}</div>
                                            <div><strong>Final pH:</strong> {output.finalPH ?? '-'}</div>
                                            <div><strong>Brix on Diluent:</strong> {output.brixOnDiluent ?? '-'}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-2 text-indigo-700">Ingredients</h3>
                                        <ul className="list-disc list-inside text-gray-700 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100">
                                            {output.productMixIngredients.map((ing) => (
                                                <li key={ing.id ?? ing.ingredientId}>
                                                    {ing.ingredient?.name ?? 'Unknown Ingredient'}: {ing.litresUsed} L
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                )}
            </div>}
        </>
    );
};
