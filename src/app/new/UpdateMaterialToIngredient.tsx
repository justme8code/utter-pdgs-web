'use client';
import React, { useState, useEffect } from "react";
import {SampleIngredient, SampleMaterialToIngredients} from "@/app/new/play-with-data";
import { useForm } from "react-hook-form";
import {Button} from "@/app/components/Button";
import {
    calAverageCostPerKgBasedOnTotalWeight, calAverageWeightPerUOMBasedOnTotalWeight,
    calculateCostPerLitre,
    calculateLitresPerKg
} from "@/app/production-computing-formulas";

type UpdateMaterialToIngredientProps = {
    data: SampleMaterialToIngredients;
    onUpdate: (updatedData: SampleMaterialToIngredients) => void;
    onChange: (data: SampleMaterialToIngredients) => void;
    onSave: (data: SampleMaterialToIngredients) => void;
    isEditMode: boolean;
};

type MaterialToIngredientsKeys = keyof SampleMaterialToIngredients;
type MaterialToIngredientsValues = SampleMaterialToIngredients[MaterialToIngredientsKeys];

export const UpdateMaterialToIngredient = ({
    data,
    onUpdate,
    onChange,
    onSave,
    isEditMode,
}: UpdateMaterialToIngredientProps) => {
    const [formData, setFormData] = useState<SampleMaterialToIngredients>(data);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setFormData(data); // Update local form state when the 'data' prop changes
    }, [data]);


    const handleChange = (field:MaterialToIngredientsKeys, value: MaterialToIngredientsValues) => {
        const updatedFormData = { ...formData };

        if (field === "totalUsable" && value) {
            updatedFormData.totalUsable = value as number;
        } else if (field === "litresLost" && value) {
            updatedFormData.litresLost = value as number;
        } else if (field === "batch" && value) {
            updatedFormData.batch = value as number;
        } /*else if (field === "ingredients" && value) {
            updatedFormData.ingredients = value as SampleIngredient[];
        }*/else if (field === "usable" && value){
            updatedFormData.usable = value as number;
        }else if (field === "costPerLitre" && value){
            updatedFormData.costPerLitre = value as number;
        }else if (field === "litresPerKg" && value){
            updatedFormData.litresPerKg = value as number;
        }else if (field === "rawBrix" && value){
            updatedFormData.rawBrix = value as number;
        }else if (field === "outPutLitres" && value){
            updatedFormData.outPutLitres = value as number;
        }
        console.log("litresLost", updatedFormData.litresLost);

        if (["usable","totalUsable"].includes(field)) {
            const {totalUsable,usable } = updatedFormData;

            // Safe default values
            const usableSafe = usable ?? 0;
            const totalUsableSafe = totalUsable ?? 0;

            updatedFormData.costPerLitre = calculateCostPerLitre({totalCost:formData.purchaseEntry.cost, usableLitres:usableSafe});
            updatedFormData.litresPerKg = calculateLitresPerKg({usableLitres:usableSafe,totalUsable:totalUsableSafe});
        }


        setFormData(updatedFormData);
        onChange(updatedFormData);
    };

    const handleSaveAndUpdate = () => {
        if (formData && isEditMode) {
            onUpdate(formData);
        } else {
            onSave(formData);
        }
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleSaveAndUpdate)}>
             <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Raw Material</label>
                     <input
                         readOnly={true}
                         className={"bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"}
                         value={formData.purchaseEntry.rawMaterial?.name || ""}
                     >
                     </input>
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Total Usable</label>
                     <input
                         {...register("totalUsable", {
                             required: "Total usable is required.",
                             min: { value: 0.0, message: "Total usable cannot be negative." },
                         })}
                            disabled={true}
                         type="number"
                         value={formData.totalUsable || 0.0}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["totalUsable"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["totalUsable"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients (auto)</label>
                     <input
                         type="text"
                         disabled={true}
                         title={formData.purchaseEntry.rawMaterial.ingredients.map((ing) => ing.name).join(", ")}
                         defaultValue={"Auto"}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Output Litres</label>
                     <input
                         {...register("outPutLitres", {
                             required: "Output litres is required.",
                             min: { value: 0.0, message: "Output litres required." },
                         })}
                         type="number"
                         value={formData.outPutLitres || 0.0}
                         onChange={(e) => handleChange("outPutLitres", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["outPutLitres"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["outPutLitres"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Litres Lost</label>
                     <input
                         {...register("litresLost", {
                             required: "Litres lost is required.",
                             min: { value: 0.0, message: "Litres lost cannot be negative." },
                         })}
                         type="number"
                         value={formData.litresLost || 0.0}
                         onChange={(e) => handleChange("litresLost", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["litresLost"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["litresLost"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
                     <input
                         {...register("batch", {
                             required: "Batch is required.",
                             min: { value: 0, message: "Batch cannot be negative." },
                         })}
                         readOnly={true}
                         type="number"
                         value={formData.batch || 0}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["batch"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["batch"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Usable</label>
                     <input
                         {...register("usable", {
                             required: "Usable is required.",
                             min: { value: 0, message: "Usable cannot be negative." },
                         })}
                         type="number"
                         value={formData.usable || 0}
                         onChange={(e) => handleChange("usable", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["usable"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["usable"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Litres Per Kg  (auto)</label>
                     <input
                         {...register("litresPerKg", {
                             required: "Litres per kg is required.",
                             min: { value: 0.0, message: "Litres per kg cannot be negative." },
                         })}
                         type="number"
                         value={formData.litresPerKg || 0.0}
                         disabled={true}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["litresPerKg"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["litresPerKg"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">₦ Cost Per Litre (auto)</label>
                     <input
                         {...register("costPerLitre", {
                             required: "Cost per litre is required.",
                             min: { value: 0.0, message: "Cost per litre cannot be negative." },
                         })}
                         disabled={true}
                         type="number"
                         value={formData.costPerLitre || 0.0}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["costPerLitre"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["costPerLitre"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Raw Brix</label>
                     <input
                         {...register("rawBrix", {
                             required: "Raw brix is required.",
                             min: { value: 0.0, message: "Output litres required." },
                         })}
                         type="number"
                         value={formData.rawBrix || 0.0}
                         onChange={(e) => handleChange("rawBrix", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["rawBrix"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["rawBrix"]?.message)}</p>
                         </div>
                     )}
                 </div>


             </div>
            <div className={"flex justify-center"}>
                <Button type={"submit"} label={"Update Row"} className={"max-h-12 max-w-40"}/>
            </div>
        </form>
    );
};
