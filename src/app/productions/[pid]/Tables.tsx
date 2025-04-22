'use client'
import {SampleProduction} from "@/app/new/play-with-data";
import PurchaseEntryTable from "@/app/new/PurchaseEntryTable";
import useSampleProductionStore from "@/app/store/sampleProductionStore";
import {useEffect, useState} from "react";
import MaterialToIngredientTable from "@/app/new/MaterialToIngredientTable";
import {Button} from "@/app/components/Button";
import {
    deleteProductionPurchaseEntry,
    updateProductionMaterialToIngredients, updateProductionPurchaseEntry,
} from "@/app/actions/production";
import useSelectedPurchaseEntriesStore from "@/app/store/selectedPurchaseEntriesStore";

export const Tables = ({sampleProduction}:{sampleProduction:SampleProduction}) => {
    const {production,setProduction} = useSampleProductionStore();
    const [loading, setLoading] = useState(false);
    const {purchaseEntryIds} = useSelectedPurchaseEntriesStore();

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

    const handleDeletePurchaseEntries = async () => {
        console.log("deleting purchase entries ", production.purchaseEntries);
        setLoading(true);

        if (purchaseEntryIds.length > 0) {
            // Filter out the entries to be deleted
            const remainingEntries = production.purchaseEntries?.filter(
                entry => !purchaseEntryIds.includes(entry.id ?? 0)
            );

            console.log("IDs to delete: ", purchaseEntryIds);
            // check if the purchaseEntries ids are of type number
            const purchaseEntryIdsToDelete = purchaseEntryIds.filter(id => typeof id === "number");
            // Call the delete API with the selected IDs
            const { status } = await deleteProductionPurchaseEntry(production.id, purchaseEntryIdsToDelete);

            if (status) {
                alert("Purchase entries deleted successfully");
                // Update the production state with the remaining entries
                setProduction({
                    ...production,
                    purchaseEntries: remainingEntries,
                });
            } else {
                alert("Failed to delete purchase entries");
            }
        } else {
            alert("No purchase entries selected for deletion");
        }

        setLoading(false);
    };

    const handleSavePurchaseEntries = async () => {
        console.log("updating purchase entries ", production.purchaseEntries);
        setLoading(true);

        if (production && production.id && production.id > 0 && production.purchaseEntries) {
            // Create a copy of purchaseEntries and set ids to null if they start with "New"
            const updatedPurchaseEntries = production.purchaseEntries.map(entry => {
                const isNewEntry = typeof entry.id === "string" && entry.id.startsWith("New");
                return {
                    ...entry,
                    id: isNewEntry ? undefined : entry.id // Set id to null for new entries
                };
            });

            console.log("updated purchase entries ", updatedPurchaseEntries);

            const { status } = await updateProductionPurchaseEntry(
                production.id,
                updatedPurchaseEntries
            );

            if (status) {
                alert("Purchase entries updated successfully");
                window.location.reload();
            } else {
                alert("Failed to update purchase entries");
            }
        }

        setLoading(false);
    };
    return (
        <main className="flex gap-20 flex-col w-full space-x-10 ">
            <div className="flex-1 flex flex-col h-full p-2 gap-5">

                    <div className="space-y-10">
                        {/*<ProductionInfo prod={data} />*/}
                        <div className="space-y-10 p-20">
                            <PurchaseEntryTable/>
                             <div className={"flex justify-end w-full gap-10"}>
                                 <Button label={"Delete"}
                                         variant={"danger"}
                                         className={""}
                                         disabled={loading}
                                         onClick={() =>  {handleDeletePurchaseEntries()}}
                                 />

                                 <Button label={"Save entries"}
                                         className={""}
                                            disabled={loading}
                                            onClick={() =>  {handleSavePurchaseEntries()}}
                                 />

                             </div>
                            <MaterialToIngredientTable/>
                            <div className={"flex justify-end w-full"}>
                                <Button label={"Save conversion"}
                                        className={"max-h-12 max-w-40"}
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