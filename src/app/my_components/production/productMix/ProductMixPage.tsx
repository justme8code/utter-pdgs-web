'use client';
import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {Modal} from "../../Modal";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {ProductionStore, ProductMix} from "@/app/types";
import {ExistingProductMixes} from "@/app/my_components/production/productMix/ExistingProductMixes";
import {CreateNewProductMix} from "@/app/my_components/production/productMix/CreateNewProductMix";


export const disabled = {disabled:true};
export interface ProductMixComponentProps {
    mix?: ProductMix; // Updated to allow null
    onSaveProductMix?: (mix: ProductMix,productionStore:ProductionStore) => void;
}

export const ProductMixPage = () => {
    const { fetchProducts } = useProductStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [productMixes,setProductMixes] = useState<ProductMix[]>([]);



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
                    <CreateNewProductMix onCreate={mix => setProductMixes([...productMixes, mix])}/>
                    {/* Existing product mixes */}
                    <ExistingProductMixes productMixes={productMixes}/>

                </div>
            </Modal>
        </>
    );
};
