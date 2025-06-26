'use client';

import {useProductStore} from "@/app/store/productStore";
import {TextField} from "@/app/my_components/TextField";
import React from "react";
import {disabled, ProductMixComponentProps} from "./ProductMixPage";


export const ProductMixView = ({mix}: ProductMixComponentProps) => {
    const {products} = useProductStore();
    const product = products.find(value => value.id === mix?.productId);
    const calculatedTotalIngredientUsage = () => {
        if (mix && mix.productMixIngredients) {
            return mix.productMixIngredients.reduce(
                (total, ingredient) => total + (ingredient.litresUsed || 0),
                0
            );
        }
        return 0;
    };

    return (
        <>
            {mix && products && products.length > 0 &&
                (

                    <div className={"flex w-full gap-5 text-center"}>
                        {/* Product Field */}
                        <div className={"space-y-5 font-medium"}>
                            <h1>Product Name</h1>
                            <input value={product?.name} className={"max-w-40 border px-2 py-1"} readOnly={true}/>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 font-medium text-center gap-5">
                                <h1>Ingredients</h1>
                                <h1>Litre Used</h1>
                            </div>

                            {mix && product && product.ingredients.map((ing, index) => (
                                <div key={index} className="grid grid-cols-2 items-center gap-5 mb-2 text-center">
                                    <TextField
                                        props={disabled}
                                        className="max-w-40 mx-auto"
                                        value={ing.name ?? ""}
                                    />


                                    <TextField
                                        props={disabled}
                                        className="max-w-40 mx-auto"
                                        type={"number"}
                                        placeholder={`Litres Used ${index + 1}`}
                                        value={mix.productMixIngredients?.find(u => u.ingredientId === ing.id)?.litresUsed ?? 0}
                                    />
                                </div>
                            ))}

                        </div>

                        <div className={"flex gap-5"}>
                            {/* Total Litres Used */}
                            <div className={"space-y-5 font-medium"}>
                                <h1>Total Litres</h1>
                                <TextField
                                    type={"number"}
                                    props={disabled}
                                    value={calculatedTotalIngredientUsage() ?? 0}
                                    className={"max-w-40 text-center"}
                                />
                            </div>


                            {["brixOnDiluent", "initialBrix", "finalBrix", "initialPH", "finalPH", "productCount"].map((field, i) => (
                                <div className="space-y-5 font-medium" key={i}>
                                    <h1>{field.replace(/([A-Z])/g, " $1").trim()}</h1>
                                    <TextField
                                        type="number"
                                        value={(mix as never)[field]}
                                        className="max-w-40 text-center"
                                        placeholder={field}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                )
            }

        </>
    );
};