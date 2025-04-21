'use client';
import React, { useState, useEffect } from "react";
import {SampleIngredient, SampleMaterialToIngredients} from "@/app/new/play-with-data";
import { useForm } from "react-hook-form";
import {Button} from "@/app/components/Button";

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
        } else if (field === "productionLost" && value) {
            updatedFormData.productionLost = value as number;
        } else if (field === "batch" && value) {
            updatedFormData.batch = value as number;
        } else if (field === "ingredients" && value) {
            updatedFormData.ingredients = value as SampleIngredient[];
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
                         type="number"
                         value={formData.totalUsable || 0.0}
                         onChange={(e) => handleChange("totalUsable", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["totalUsable"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["totalUsable"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients</label>
                     <input
                         type="text"
                         disabled={true}
                         value={formData.purchaseEntry.rawMaterial.ingredients.map((ing) => ing.name).join(", ")}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Production Lost</label>
                     <input
                         {...register("productionLost", {
                             required: "Production lost is required.",
                             min: { value: 0.0, message: "Production lost cannot be negative." },
                         })}
                         type="number"
                         value={formData.productionLost || 0.0}
                         onChange={(e) => handleChange("productionLost", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["productionLost"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["productionLost"]?.message)}</p>
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
                         type="number"
                         value={formData.batch || 0}
                         onChange={(e) => handleChange("batch", parseFloat(e.target.value))}
                         className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                     />
                     {errors["batch"] && (
                         <div className="text-red-500 text-sm mt-1">
                             <p>{String(errors["batch"]?.message)}</p>
                         </div>
                     )}
                 </div>
                 <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Litres Per Kg</label>
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
                     <label className="block text-gray-700 text-sm font-bold mb-2">Cost Per Litre</label>
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

             </div>
            <div className={"flex justify-center"}>
                <Button type={"submit"} label={isEditMode?"Update Row":"Save New Row"} className={"max-h-12 max-w-40"}/>
            </div>
        </form>
    );
};
