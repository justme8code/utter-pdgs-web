'use client';
import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {ProductMixComponent} from "@/app/components/production/productMix/ProductMixComponent";

import {useProductionStore} from "@/app/store/productionStore";
import {Modal} from "../../Modal";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {ProductMix} from "@/app/types";
import {fetchProductionMixes} from "@/app/actions/production";


export const ProductMixPage = () => {
    const { fetchProducts } = useProductStore();
    const { selectedProduction,setSelectedProduction } = useProductionStore();
    const {products} = useProductStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const [productionMixes, setProductionMixes] = useState<ProductMix[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);



    useEffect(() => {
        fetchIngredients();
        fetchProducts();
    }, [fetchIngredients, fetchProducts]);

    return (
        <>
            <div className="">
                {ingredients && ingredients.length > 0 && (
                    <button
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Mix
                    </button>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-full h-screen overflow-scroll">
                <div className="p-6 space-y-5 ">

                    {/* Creation form for a new product mix */}
                    <div className="mb-5">
                        <h1 className="font-bold text-gray-600 text-xl" >Create Product Mix</h1>
                        <div className="mt-4">
                            <ProductMixComponent
                                onEdit={true}
                                onSaveProductMix={(mix,productionStore) => {
                                    setProductionMixes(prevState => [...prevState, mix]);
                                    if(selectedProduction && selectedProduction.id){
                                        const updated = selectedProduction;
                                        updated.productionStore = productionStore;
                                        setSelectedProduction(updated);
                                    }
                                }} mix={null}/>
                        </div>
                    </div>

                    {/* Existing product mixes */}
                    <div className="bg-gray-100 w-full p-5 space-y-10 rounded-xs">
                        {productionMixes && ingredients && productionMixes.length > 0 && ingredients.length > 0 ? productionMixes
                            .sort((a, b) => (a.id??0) - (b.id??0))
                            .map((value, index) => (
                                <div key={index} className="space-y-5">
                                    <ProductMixComponent
                                        onEdit={false}
                                        mix={value}
                                        onSaveProductMix={(mix,productionStore) => {
                                            setProductionMixes(prevState => [...prevState, mix]);
                                            if(selectedProduction && selectedProduction.id){
                                                const updated = selectedProduction;
                                                updated.productionStore = productionStore;
                                                setSelectedProduction(updated);
                                            }
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
                                        {
                                            products.length <=0 && (
                                                <div>
                                                    {"There are no product template available"}
                                                </div>
                                            )
                                        }
                                    </h1>
                                </div>
                            )}
                    </div>


                </div>
            </Modal>
        </>
    );
};
