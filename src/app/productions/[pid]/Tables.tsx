'use client'
import {SampleProduction} from "@/app/new/play-with-data";
import PurchaseEntryTable from "@/app/new/PurchaseEntryTable";
import useSampleProductionStore from "@/app/store/sampleProductionStore";
import {useEffect, useState} from "react";
import MaterialToIngredientTable from "@/app/new/MaterialToIngredientTable";
import {Button} from "@/app/components/Button";
import {updateProductionMaterialToIngredients} from "@/app/actions/production";

export const Tables = ({sampleProduction}:{sampleProduction:SampleProduction}) => {
    const {production,setProduction} = useSampleProductionStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProduction(sampleProduction);
    }, [sampleProduction, setProduction]);

    const handleSaveConversion = async () => {
        console.log("updating conversion ", production.materialToIngredients);
        setLoading(true);
        if(production && production.id && production.id > 0 && production.materialToIngredients){
            const  {status} = await updateProductionMaterialToIngredients(
                production.id,
                production.materialToIngredients
            );

            if(status){
                alert("Conversion updated successfully");
            }else{
                alert("Failed to update conversion");
            }
        }
        setLoading(false);

    }
    return (
        <main className="flex gap-20 flex-col w-full h-screen space-x-10 bg-gray-50">
            <div className="flex-1 flex flex-col h-full p-2 gap-5">

                    <div className="space-y-10">
                        {/*<ProductionInfo prod={data} />*/}
                        <div className="space-y-10 p-20">
                            <PurchaseEntryTable/>
                             <div className={"flex justify-end w-full"}>
                                 <Button label={"Save entries"}
                                         onClick={() =>  {}}
                                 />
                             </div>
                            <MaterialToIngredientTable/>
                            <div className={"flex justify-end w-full"}>
                                <Button label={"Save conversion"}
                                        disabled={loading}
                                        onClick={() =>  {
                                            handleSaveConversion();
                                        }}
                                />
                            </div>
                        </div>
                    </div>

               {/* <div className={"flex justify-end p-4"}>
                    <Button label={"Update production"} href={`/productions/${pid}/update`}/>
                </div>*/}
            </div>
        </main>
    );
};