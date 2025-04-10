'use client';

import {TextField} from "@/app/components/TextField";
import {CheckCircle, TrashIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {ProductMixDataType} from "@/app/product";
import {useProductionStore} from "@/app/store/productionStore";
import {createProductMix, deleteProductMix, updateProductMix} from "@/app/productions/actions";

export const ProductMixComponent = ({mix,onSave,onDelete}:{mix:ProductMixDataType,onSave:(mix:ProductMixDataType)=>void,onDelete?:(status:boolean)=>void}) => {
    const [productMix, setProductMix] = useState<ProductMixDataType>(mix);
    const {selectedProduction} = useProductionStore();
    const { products} = useProductStore();
    const {ingredients} = useIngredientStore();
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        setProductMix(mix)
    },[mix]);

    const handleCreate = async ()=> {
        setLoading(true);
        if (selectedProduction && selectedProduction.id) {

            const s = {...productMix,
                productionId: selectedProduction.id,
                productId: products[selectedIndex].id,
                totalLitersUsed:calculatedTotalIngredientUsage()
            };
            const {data,status} = await createProductMix(s);
            if(status){
                onSave(data);
            }
        }
        setLoading(false);
    }

    const handleUpdate = async ()=> {
        setLoading(true);
        if (selectedProduction && selectedProduction.id) {
            console.log("In here...");
            const s = {...productMix,
                productionId: selectedProduction.id,
                productId: products[selectedIndex].id,
                totalLitersUsed:calculatedTotalIngredientUsage()
            };
            const {data,status} = await updateProductMix(s);
            if(status){
                console.log("updated..")
                setProductMix(data);
            }
        }
        setLoading(false);
    }

    const calculatedTotalIngredientUsage = () => {
        if (productMix.ingredientUsages) {
            return productMix.ingredientUsages.reduce(
                (total, ingredient) => total + (ingredient.litresUsed || 0),
                0
            );
        }
        return 0;
    };


    const handleCall = async ()=> {

        if(productMix.id && productMix.id>0){
            handleUpdate();
        }else{
            handleCreate();
        }

    }

    const deletePM = async ()=>{
        setLoading(true);
        if(productMix.id && productMix.id>0){
            const {status} = await deleteProductMix(productMix.id);
            if(status && onDelete){
                 onDelete(status);
            }
        }
        setLoading(false);
    }

    return (
        <>
            { products && products.length > 0 ?
                (
                    <>
                        <div className={"flex w-full gap-10"}>
                            {/* Product Field */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Product</h1>
                                <select
                                    value={selectedProduct || ""}
                                    onChange={(e) => {
                                        const index = e.target.selectedIndex;
                                        setSelectedIndex(index);
                                        setSelectedProduct(e.target.value);
                                    }}
                                    className={"max-w-40 border border-gray-300 rounded-xs px-2 py-1 outline-none focus:ring-2 focus:ring-slate-500 focus:border-none focus:outline-none"}
                                >
                                    <option value={products[0].name}>{products[selectedIndex].name}</option>
                                    {products.map((product, index) => (
                                        index !== 0 ? (
                                            <option key={product.id ?? index} value={product.id ?? index}>
                                                {product.name}
                                            </option>
                                        ) : null
                                    ))}
                                </select>
                            </div>


                            {/* Ingredients */}
                            <div className={"space-y-5 "}>
                                <div className={"flex space-x-24 font-medium"}>
                                    <h1>Ingredients</h1>
                                    <h1 className={"space-x-1"}>Litres Used</h1>
                                </div>
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className={"flex justify-center gap-5 mb-2"}>
                                        <TextField
                                            props={{disabled:true}}
                                            className={"max-w-40 text-center"}
                                            defaultValue={ingredient.name}
                                        />

                                        {/*litres used*/}
                                        <TextField
                                            className={"max-w-40 text-center"}
                                            placeholder={`Litres Used ${index + 1}`}
                                            type={"number"}
                                            value={
                                                productMix.ingredientUsages?.find(u => u.ingredientId === ingredient.id)?.litresUsed ?? 0
                                            }
                                            onChange={(value) => {
                                                const litres = Number(value);

                                                setProductMix(prev => {
                                                    const existingUsages = [...(prev.ingredientUsages ?? [])];
                                                    const usageIndex = existingUsages.findIndex(u => u.ingredientId === ingredient.id);
                                                    if (usageIndex !== -1) {
                                                        // Update existing
                                                        existingUsages[usageIndex].litresUsed = litres;
                                                    } else {
                                                        // Add new
                                                        if(ingredient.id){
                                                            existingUsages.push({
                                                                ingredientId: ingredient.id,
                                                                litresUsed: litres,
                                                            });
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        ingredientUsages: existingUsages,
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Total Litres Used */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Total Litres Used</h1>
                                <TextField
                                    type={"number"}
                                    props={{disabled:true}}
                                    value={calculatedTotalIngredientUsage()}
                                    className={"max-w-40 text-center"}
                                />
                            </div>



                            {/* Brix No Diluent */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Brix No Diluent</h1>
                                <TextField
                                    type={"number"}
                                    value={productMix.brixOnDiluent??0}
                                    className={"max-w-40 text-center"}
                                    placeholder={"Brix No Diluent"}
                                    onChange={value => {
                                        setProductMix({...productMix, brixOnDiluent: Number(value)});
                                    }}
                                />
                            </div>

                            {/* Initial Brix */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Initial Brix</h1>
                                <TextField
                                    type={"number"}
                                    value={productMix.initialBrix??0}
                                    className={"max-w-40 text-center"}
                                    placeholder={"Initial Brix"}
                                    onChange={value => {
                                        setProductMix({...productMix, initialBrix: Number(value)});
                                    }}
                                />
                            </div>

                            {/* Final Brix */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Final Brix</h1>
                                <TextField
                                    type={"number"}
                                    value={productMix.finalBrix??0}
                                    className={"max-w-40 text-center"}
                                    placeholder={"Final Brix"}
                                    onChange={value => {
                                        setProductMix({...productMix, finalBrix: Number(value)});
                                    }}
                                />
                            </div>

                            {/* Initial pH */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Initial pH</h1>
                                <TextField
                                    type={"number"}
                                    value={productMix.initialPH??0}
                                    className={"max-w-40 text-center"}
                                    placeholder={"Initial pH"}
                                    onChange={value => {
                                        setProductMix({...productMix, initialPH: Number(value)});
                                    }}
                                />
                            </div>

                            {/* Final pH */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Final pH</h1>
                                <TextField
                                    type={"number"}
                                    value={productMix.finalPH??0}
                                    className={"max-w-40 text-center"}
                                    placeholder={"Final pH"}
                                    onChange={value => {
                                        setProductMix({...productMix, finalPH: Number(value)});
                                    }}
                                />
                            </div>


                        </div>
                        <div className={"flex justify-end gap-4"}>
                            <button
                                className={`text-sm px-3 py-2 rounded flex items-center gap-2 transition ${
                                    loading
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : productMix.id && productMix.id > 0
                                            ? "bg-gray-400 hover:bg-gray-500 text-black"
                                            : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}

                                type="submit" onClick={() => {
                                handleCall();
                            }}>
                                <CheckCircle className="h-5 w-5" />
                                {productMix.id && productMix.id > 0? "Update":loading?"processing...":"Submit"}
                            </button>

                            {
                                productMix.id && productMix.id > 0 &&  <button
                                        className={`text-sm px-3 py-2 rounded flex items-center gap-2 transition ${
                                            loading
                                                ? "bg-red-300 text-white cursor-not-allowed"
                                                : productMix.id && productMix.id > 0
                                                    ? "bg-red-400 hover:bg-red-600 text-white"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                        }`}

                                        type="submit" onClick={() => {
                                        deletePM();
                                    }}>
                                        <TrashIcon className="h-5 w-5" />
                                        {loading?"processing...":"Delete"}
                                    </button>

                                }


                        </div>
                    </>
                ):<div>
                    <h1>Create a Product to create a Product Mix</h1>
                </div>

            }

        </>

    );
};