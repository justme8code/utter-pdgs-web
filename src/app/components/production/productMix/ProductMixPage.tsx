'use client';
import React, { useEffect, useState } from "react";
import { useProductStore } from "@/app/store/productStore";
import { ProductMixComponent } from "@/app/components/production/productMix/ProductMixComponent";
import { fetchProductionMixes, fetchProductMixes } from "@/app/actions/production";
import { useProductionStore } from "@/app/store/productionStore";
import { Modal } from "../../Modal";
import { useIngredientStore } from "@/app/store/ingredientStore";
import { ProductMix } from "@/app/product";

export const ProductMixPage = () => {
    const { fetchProducts } = useProductStore();
    const { selectedProduction } = useProductionStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const [productionMixes, setProductionMixes] = useState<ProductMix[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (selectedProduction?.id) {
                const fetchMixes = async () => {
                    if (search.trim()) {
                        const { data, status } = await fetchProductMixes(0, 100, search);
                        if (status && data) {
                            setProductionMixes(data.content);
                        }
                    } else {
                        const { data, status } = await fetchProductionMixes(selectedProduction.id);
                        if (status) {
                            setProductionMixes(data ?? []);
                        }
                    }
                };
                fetchMixes();
            }
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [selectedProduction?.id, search]);

    useEffect(() => {
        fetchIngredients();
        fetchProducts();
    }, [fetchIngredients, fetchProducts]);

    return (
        <>
            <div className="px-20">
                {ingredients && ingredients.length > 0 && (
                    <button
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Production Mix
                    </button>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-full h-screen">
                <div className="p-6 space-y-5">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">Production Mix</h1>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search mixes"
                                aria-label="Search mixes"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border border-gray-300 p-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Creation form for a new product mix */}
                    <div className="mb-5">
                        <h1 className="font-bold text-gray-600">Create a new Product Mix</h1>
                        <div className="mt-4">
                            <ProductMixComponent
                                onSaveProductMix={mix => {
                                    setProductionMixes(prevState => [...prevState, mix]);
                                }} mix={null}/>
                        </div>
                    </div>

                    {/* Existing product mixes */}
                    <div className="bg-gray-100 w-full p-5 space-y-10 rounded-xs">
                        {productionMixes && ingredients && productionMixes.length > 0 && ingredients.length > 0 ? productionMixes
                            .sort((a, b) => a.id - b.id)
                            .map((value, index) => (
                                <div key={index} className="space-y-5">
                                    <ProductMixComponent
                                        mix={value}
                                        onSaveProductMix={mix => {
                                            setProductionMixes(prevState => [...prevState, mix]);
                                        }}
                                        onDelete={status => {
                                            if (status) {
                                                setProductionMixes(prev => prev.filter((_, i) => i !== index));
                                            }
                                        }}
                                    />
                                    {index !== productionMixes.length - 1 && (
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    )}
                                </div>
                            ))
                            : (
                                <div className="flex justify-center">
                                    <h1 className="text-xl font-medium text-gray-500">
                                        {"Can't create a production mix without an ingredient"}
                                    </h1>
                                </div>
                            )}
                    </div>
                </div>
            </Modal>
        </>
    );
};
