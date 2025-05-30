'use client';
import React, { useState } from 'react'; // Import useState!
import {Conversion, ConversionField, Ingredient, Purchase} from '@/app/types';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { EditableConversion } from '@/app/productions/component/conversion/EditableConversion';
import { getIngredientsByRawmaterialId } from '@/app/actions/inventory';
import { X } from 'lucide-react';
import LoadingWrapper from "@/app/components/LoadingWrapper";
import {createConversion} from "@/app/actions/conversion";
import {useProductionStore} from "@/app/store/productionStore";
import {useConversionStore} from "@/app/store/conversionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {useLoadingUI} from "@/app/store/useLoadingUI";

type ConversionButtonProps = {
    row: Purchase;
};
function assignDefaultsToNumberFields(obj: ConversionField, excludeKeys: (keyof ConversionField)[] = []) {
    for (const key of Object.keys(obj) as (keyof ConversionField)[]) {
        if (excludeKeys.includes(key)) continue;

        if (key === "ingredient") continue;

        const value = obj[key];

        // Skip if it's already a valid number (either actual number or numeric string)
        const numericValue = typeof value === "string" ? parseFloat(value) : value;

        const isValidNumber = typeof numericValue === "number" && !isNaN(numericValue);

        if (!isValidNumber) {
            obj[key] = 0 as never;
        }
    }
}


export const ConversionModal: React.FC<ConversionButtonProps> = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ing, setIng] = useState<Ingredient[]>([]);
    const {addConversion} = useConversionStore();
    const {updatePurchase} = usePurchaseStore();
    const {loading,setSuccessMessage,setLoading} = useLoadingUI();
    const [invalidMessage,setInvalidMessage] = useState<string|null>(null);
    const {selectedProduction,setSelectedProduction} = useProductionStore();
    const [conversion,setConversion] = useState<Conversion>({
        id: null,
            batch: 0,
            productionId: 0,
            purchaseId: 0,
            fields: [],
    });


    const handleUpdateConversionField = (ingId:number,updatedField:ConversionField)=>{
        setConversion(conversion=> {
            return {
                ...conversion,
                fields: conversion.fields.map((field) =>
                    field.ingredient?.id === ingId ? updatedField : field
                ),
            }
        })
    }

    const handleResetConversionField = ()=>{
        setConversion(conversion =>{
            return {
                ...conversion,
                id: null,
                batch: 0,
                productionId: 0,
                purchaseId: 0,
                fields: [],
            }
        })
    }

    const rawMaterialId = row?.rawMaterial?.id;
    const totalUsable = row.purchaseUsage?.usableWeightLeft || 0;




    const handleSave = async () => {
        let isInvalid = false;

        for (const field of conversion.fields) {
            if (field.kgUsed === undefined || field.kgUsed === 0) {
                setInvalidMessage("Kg used cannot be empty");
                isInvalid = true;
                break;
            }

            // Sanitize other undefined fields (except kgUsed)
            for (const field of conversion.fields) {
                assignDefaultsToNumberFields(field, ["kgUsed", "ingredient"]);
            }

        }

        if (isInvalid) return;

        setLoading(true);
        console.log('Conversion Data:', conversion);

        if (selectedProduction && selectedProduction.id && row.id) {
            const { data, status, message } = await createConversion(selectedProduction.id, row.id, conversion);
            if (status) {
                setSuccessMessage("Conversion created", status);
                const production = { ...selectedProduction, productionStore: data.productionStore };
                setSelectedProduction(production);
                addConversion(data.conversion);
                updatePurchase(data.purchase);
            } else {
                setSuccessMessage(message);
            }
        }

        setLoading(false);
        close();
    };


    const open = async () => {
        handleResetConversionField() // Clear it *before* loading fresh data

        if (!rawMaterialId) return;

        const { data, status } = await getIngredientsByRawmaterialId(rawMaterialId);
        if (status && data) {
            setIng(data);
            const initialConversion: Conversion = {
                id: null,
                batch: 0,
                productionId: 0,
                purchaseId: row.id ?? 0,
                fields: data.map((ingredient) => ({
                    id: null,
                    kgUsed: undefined,
                    usableLitres: undefined,
                    outPutLitres: undefined,
                    productionLitresLost: undefined,
                    costPerLitre: undefined,
                    rawBrix: undefined,
                    litresPerKg: undefined,
                    ingredient: ingredient,
                })),
            };
            setConversion(initialConversion);
        } else {
            console.error('Failed to fetch ingredients:', status);
            setIng([]);
        }

        setIsOpen(true);
    };


    const close = () => {
        setIsOpen(false);
        setInvalidMessage(null); // Clear error if it's now valid
        handleResetConversionField();
    };

    const handleOnFieldChange = (ingredientId: number, updatedField: ConversionField) => {
        const updatedFields = conversion.fields.map(field =>
            field.ingredient?.id === ingredientId ? updatedField : field
        );

        const sumOfTotalKgUsed = updatedFields.reduce((acc, curr) => acc + (Number(curr.kgUsed) || 0), 0);
        const usableWeight = row.purchaseUsage?.usableWeightLeft ?? 0;

        console.log("Sum of Total Kg Used:", sumOfTotalKgUsed);
        console.log("Usable Weight:", usableWeight);

        const validate = (sumOfTotalKgUsed > usableWeight);
        // Check that the sum is not greater than the usable weight
        if (validate) {
            setInvalidMessage(`Summed kg Used cannot exceed total usable weight of ${usableWeight}`);
        } else {
            setInvalidMessage(null); // Clear error if it's valid
            handleUpdateConversionField(ingredientId, updatedField); // Update the field
        }
    };



    return (
        <div>
            <Button
                disabled={!!selectedProduction?.finalized}
                title={Number(row.purchaseUsage?.usableWeightLeft).toFixed(2)}
                onClick={open}
                className={` ${isOpen?"bg-blue-500":"bg-blue-300"} ${selectedProduction?.finalized ? "bg-gray-300 hover:bg-none":"hover:bg-blue-400"}  p-2 shadow-xs   text-black rounded-sm   `}
            >
                Convert
            </Button>


                <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>

                         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                             <div className="flex min-h-full items-center justify-center p-4  overflow-y-auto">
                                 <DialogPanel
                                     transition
                                     className="w-full max-w-6xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-2xl"
                                 >

                                     <DialogTitle as="h3" className="text-base/7 font-medium  ">
                                         <div
                                             className={"flex justify-between mb-5 items-center border-b-1 border-gray-200 space-y-3 p-2"}
                                         >
                                             <div>
                                                 <h1 className={"font-medium text-2xl"}>Conversion</h1>
                                                 <h2 className={"text-gray-500 font-medium"}>Make conversion</h2>
                                             </div>
                                             <div className={"flex gap-1 justify-center"}>
                                                 <p className={"text-gray-500"}>Ingredients</p>
                                                 <div
                                                     className={"px-2 text-sm flex justify-center items-center text-white rounded-full bg-blue-500   "}
                                                 >
                                                     {' '}
                                                     {ing.length}
                                                 </div>
                                             </div>
                                         </div>
                                     </DialogTitle>

                                     <LoadingWrapper isLoading={loading}>



                                     <div className={"overflow-y-auto flex w-full gap-2 "}>
                                         <div className={"flex gap-3 justify-center"}>
                                             <div className="">
                                                 <label className="block text-gray-700 text-sm font-bold mb-3">
                                                     Raw Material
                                                 </label>
                                                 <input
                                                     readOnly={true}
                                                     value={row.rawMaterial?.name}
                                                     className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                                                 />
                                             </div>
                                             <div className="">
                                                 <label className="block text-gray-700 text-sm font-bold mb-3">
                                                     Total Usable
                                                 </label>
                                                 <input
                                                     readOnly={true}
                                                     value={totalUsable}
                                                     className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                                                 />
                                             </div>

                                         </div>

                                         <div className={""}>
                                             {ing.map((item) => (
                                                 <EditableConversion
                                                     key={item.id}
                                                     ingredient={item}
                                                     showLabel={ing.indexOf(item) === 0}
                                                     purchase={row}
                                                     conversion={conversion}
                                                     onFieldChange={(ingredientId, updatedField) => {
                                                         handleOnFieldChange(ingredientId,updatedField);
                                                     }}
                                                 />
                                             ))}
                                         </div>
                                     </div>
                                     </LoadingWrapper>

                                     <div className="mt-4 flex justify-between">
                                         {invalidMessage ? (<p className={"text-red-500"}>{invalidMessage}</p>):<div></div>}

                                         <Button
                                             className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner
                                              shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                             onClick={handleSave}
                                         >
                                             Save
                                         </Button>
                                     </div>

                                     <div className="mt-4 flex justify-center absolute top-0 right-0">
                                         <Button
                                             className="p-1 hover:bg-red-500 rounded-sm"
                                             onClick={close}
                                         >
                                             <X className={"hover:text-white"} />
                                         </Button>
                                     </div>
                                 </DialogPanel>
                             </div>
                         </div>

                </Dialog>
        </div>
    );
};
