import {ProductMixComponent} from "@/app/my_components/production/productMix/ProductMixComponent";
import React from "react";
import {useProductionStore} from "@/app/store/productionStore";
import {ProductMix} from "@/app/types";

export const CreateNewProductMix = ({onCreate}:{onCreate:(mix:ProductMix)=>void}) => {
    const { selectedProduction,setSelectedProduction } = useProductionStore();

    return (
        <>

            {/* Creation form for a new product mix */}
            <div className="mb-5">
                <h1 className="font-bold text-gray-600 text-xl" >Create Product Mix</h1>
                <div className="mt-4">
                    <ProductMixComponent
                        onSaveProductMix={(mix,productionStore) => {
                            onCreate(mix);
                            if(selectedProduction && selectedProduction.id){
                                const updated = selectedProduction;
                                updated.productionStore = productionStore;
                                setSelectedProduction(updated);
                            }
                        }}/>
                </div>
            </div>
        </>
    );
};