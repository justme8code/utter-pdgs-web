import {ProductMixView} from "@/app/my_components/production/productMix/ProductMixView";
import React from "react";
import {ProductMix} from "@/app/types";

export const ExistingProductMixes = ({productMixes}:{productMixes:ProductMix[]}) => {

    return (
        <>

            <div className="bg-gray-100 w-full p-5 space-y-10 rounded-xs">
                {
                    productMixes.length > 0 && productMixes.map((mix,index) => (
                        <ProductMixView key={index} mix={mix}/>
                    ))
                }
            </div>

        </>
    );
};