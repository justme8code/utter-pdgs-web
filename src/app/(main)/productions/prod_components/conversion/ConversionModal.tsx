'use client';
import React, {useState} from 'react'; // Import useState!
import {Conversion, ConversionField, Ingredient, Purchase} from '@/app/types';
import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react';
import {EditableConversion} from '@/app/(main)/productions/prod_components/conversion/EditableConversion';
import {getIngredientsByRawmaterialId} from '@/api/inventory';
import {X} from 'lucide-react';
import LoadingWrapper from "@/app/my_components/LoadingWrapper";
import {createConversion} from "@/api/conversion";
import {useProductionStore} from "@/app/store/productionStore";
import {useConversionStore} from "@/app/store/conversionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {useLoadingUI} from "@/app/store/useLoadingUI";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

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


export const ConversionModal: React.FC<ConversionButtonProps> = ({row}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ing, setIng] = useState<Ingredient[]>([]);
    const {addConversion} = useConversionStore();
    const {updatePurchase} = usePurchaseStore();
    const {loading, setLoading} = useLoadingUI();
    const [invalidMessage, setInvalidMessage] = useState<string | null>(null);
    const {selectedProduction, setSelectedProduction} = useProductionStore();
    const [conversion, setConversion] = useState<Conversion>({
        id: null,
        batch: 0,
        productionId: 0,
        purchaseId: 0,
        fields: [],
    });

    const purchaseUsableLeft = row.purchaseUsage?.usableWeightLeft;
    const isFinalized = !!selectedProduction?.finalized;
    const isInvalidWeight = purchaseUsableLeft && isNaN(purchaseUsableLeft);
    const isZeroWeight = purchaseUsableLeft == 0;

// Only enable if not finalized AND weight is valid (>0)
    const isDisabled = isFinalized || (!isFinalized && (isInvalidWeight || isZeroWeight));
    const isUsable = !isDisabled;

// Used if it's not usable AND not finalized
    const isUsed = !isUsable && !isFinalized;

    const isGray = isFinalized && purchaseUsableLeft;
    const buttonClasses = `
  p-2 shadow-xs text-black rounded-sm
  ${isUsed ? "" : isOpen ? "bg-blue-500" : "bg-blue-300"}
  ${isUsed ? "" : isGray ? "bg-gray-300 hover:bg-none" : "hover:bg-blue-400"}
  ${isInvalidWeight ? "bg-red-100 text-black hover:bg-none" : ""}
`;

    const handleUpdateConversionField = (ingId: number, updatedField: ConversionField) => {
        setConversion(conversion => {
            return {
                ...conversion,
                fields: conversion.fields.map((field) =>
                    field.ingredient?.id === ingId ? updatedField : field
                ),
            }
        })
    }

    const handleResetConversionField = () => {
        setConversion(conversion => {
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
            if (field.kgUsed === undefined) {
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
            const {data, status, message} = await createConversion(selectedProduction.id, row.id, conversion);
            if (status && data) {
                toast.success(`${message}`)
                const production = {...selectedProduction, productionStore: data.productionStore};
                setSelectedProduction(production);
                addConversion(data.conversion);
                updatePurchase(data.purchase);
            } else {
                toast.error(`${message}`)
            }
        }

        setLoading(false);
        close();
    };


    const open = async () => {
        handleResetConversionField() // Clear it *before* loading fresh data

        if (!rawMaterialId) return;

        const {data, status} = await getIngredientsByRawmaterialId(rawMaterialId);
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
        const changedValue = Number(updatedField.kgUsed);

        // --- VALIDATION ---
        // 1. Check if the individual input value is invalid (negative or zero).
        //    We only check if the field isn't empty, allowing the user to clear it without an error.
        const isIndividualValueInvalid = updatedField.kgUsed != null && changedValue < 0;

        // 2. Check if the total sum exceeds the available weight.
        const isSumInvalid = sumOfTotalKgUsed > usableWeight;

        if (isIndividualValueInvalid) {
            setInvalidMessage('Value cannot be empty or negative');
        } else if (isSumInvalid) {
            setInvalidMessage(`Total used (${sumOfTotalKgUsed.toFixed(2)}kg) cannot exceed available weight (${usableWeight.toFixed(2)}kg).`);
        } else {
            // If all checks pass, clear the message and update the state.
            setInvalidMessage(null);
            handleUpdateConversionField(ingredientId, updatedField);
        }
    };


    return (
        <div>
            <Button
                disabled={isDisabled}
                title={Number(row.purchaseUsage?.usableWeightLeft).toFixed(2)}
                onClick={isUsable ? open : undefined}
                className={buttonClasses}
            >
                <p>{isUsable ? "Convert" : "Used"}</p>
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>

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
                                        {ing.map((item, index) => (
                                            <EditableConversion
                                                key={item.id}
                                                ingredient={item}
                                                showLabel={index === 0}
                                                purchase={row}
                                                conversion={conversion}
                                                onFieldChange={(ingredientId, updatedField) => {
                                                    handleOnFieldChange(ingredientId, updatedField);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </LoadingWrapper>

                            <div className="mt-4 flex justify-between">
                                {invalidMessage ? (<p className={"text-red-500"}>{invalidMessage}</p>) : <div></div>}

                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner
                                              shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={handleSave}
                                    disabled={!!invalidMessage}
                                >
                                    Save
                                </Button>
                            </div>

                            <div className="mt-4 flex justify-center absolute top-0 right-0">
                                <Button
                                    className="p-1 hover:bg-red-500 rounded-sm"
                                    onClick={close}
                                >
                                    <X className={"hover:text-white"}/>
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>

            </Dialog>
        </div>
    );
};