'use client';
import React, { useState, useEffect } from "react";
import {SamplePurchaseEntries, SampleRawMaterial, SampleSupplier} from "@/app/new/play-with-data";
import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";
import {useForm} from "react-hook-form";
import {Button} from "@/app/components/Button";
import {
    calAverageCostPerKgBasedOnTotalWeight,
    calAverageWeightPerUOMBasedOnTotalWeight
} from "@/app/production-computing-formulas";

interface UpdatePurchaseEntryProps {
    data: SamplePurchaseEntries;
    onChange: (data: SamplePurchaseEntries) => void;
    onSave: (data: SamplePurchaseEntries) => void;
    onUpdate: (data: SamplePurchaseEntries) => void;
    isEditMode:boolean;
}
type PurchaseEntryKeys = keyof SamplePurchaseEntries;
type PurchaseEntryValues = SamplePurchaseEntries[PurchaseEntryKeys];


export const UpdatePurchaseEntry = ({ data, onUpdate,onChange,onSave,isEditMode }:UpdatePurchaseEntryProps) => {
    const [formData, setFormData] = useState<SamplePurchaseEntries>(data);
    const {rawMaterials} = useRawMaterialStore();
    const {suppliers} = useSupplierStore();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setFormData(data); // Update local form state when the 'data' prop changes
    }, [data]);



    const handleChange = (field: PurchaseEntryKeys, value: PurchaseEntryValues) => {
        const updatedFormData = { ...formData };

        if (field === "rawMaterial" && value) {
            updatedFormData.rawMaterial = value as SampleRawMaterial; // Update the rawMaterial object
            updatedFormData.uom = (value as SampleRawMaterial).uom;     // Directly update the uom in formData
            setValue("uom", (value as SampleRawMaterial).uom);         // Update react-hook-form's state for uom
        } else if (field === "supplier" && value) {
            updatedFormData.supplier = value as SampleSupplier; // Type assertion
        }
        else if (field === "qty" && value) {
            updatedFormData.qty = value as number; // Type assertion
        } else if (field === "weight" && value) {
            updatedFormData.weight = value as number; // Type assertion
        } else if (field === "productionLost" && value) {
            updatedFormData.productionLost = value as number; // Type assertion
        } else if (field === "usable" && value) {
            updatedFormData.usable = value as number; // Type assertion
        } else if (field === "cost" && value) {
            updatedFormData.cost = value as number; // Type assertion
        } else if (field === "avgCost" && value) {
            updatedFormData.avgCost = value as number; // Type assertion
        } else if (field === "avgWeightPerUOM" && value) {
            updatedFormData.avgWeightPerUOM = value as number; // Type assertion
        }


        // Do calculations if fields that impact avgCost or avgWeightPerUOM changed
        if (["weight", "usable", "cost", "qty"].includes(field)) {
            const { cost, weight,qty } = updatedFormData;

            // Safe default values
            const costSafe = cost ?? 0;
            const weightSafe = weight ?? 0;
            const qtySafe = qty ?? 0;

            updatedFormData.avgCost = calAverageCostPerKgBasedOnTotalWeight({cost:costSafe,weight:weightSafe});
            updatedFormData.avgWeightPerUOM = calAverageWeightPerUOMBasedOnTotalWeight({weight:weightSafe,qty:qtySafe});
        }

        setFormData(updatedFormData);
        onChange(updatedFormData);
    };
    
    const handleSaveAndUpdate = () => {
        if(formData && isEditMode){
            onUpdate(formData);
        }
        else{
            onSave(formData);
        }
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleSaveAndUpdate)}  >
            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Raw Material Name</label>
                    <select
                        {...register("rawMaterial", {
                            required: `Raw material is required.`,
                        })}
                        className={"bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"}
                        value={formData.rawMaterial?.id || ""}
                        onChange={(e) => {
                            const selectedMaterial = rawMaterials.find(material => material.id === parseInt(e.target.value));
                            handleChange("rawMaterial", selectedMaterial);
                        }}
                    >
                        <option value="" disabled={true}>Select Raw Material</option>
                        {rawMaterials.map((material) => (
                            <option key={material.id} value={material.id}>
                                {material.name}
                            </option>
                        ))}
                    </select>
                    {errors["rawMaterial"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["rawMaterial"]?.message)}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">UoM</label>
                    <input
                        {...register("uom", {
                            required: `Select a raw material.`,
                        })}
                        name={"uom"}
                        disabled={true}
                        type="text"
                        value={formData.rawMaterial?.uom || ''}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />

                    {errors["uom"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["uom"]?.message)}</p>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Supplier Full Name</label>
                    <select
                        {...register("supplier", {
                            required: `Supplier is required`,
                        })}
                        className={"bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"}
                        value={formData.supplier?.id || ""}
                        onChange={(e) => {
                            const selectedSupplier = suppliers.find(supplier => supplier.id === parseInt(e.target.value));
                            handleChange("supplier", selectedSupplier);
                        }}
                    >
                        <option value="" disabled={true}>Select supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id.toString()}>
                                {supplier.fullName}
                            </option>
                        ))}
                    </select>
                    {errors["supplier"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["supplier"]?.message)}</p>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                    <input
                        {...register("qty", {
                            required: "Quantity is required.",
                            min: { value: 1, message: "Quantity must be at least 1." },
                        })}
                        name={"qty"}
                        type="number"
                        value={formData.qty || 0}
                        onChange={(e) => handleChange("qty", parseFloat(e.target.value))}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />
                    {errors["qty"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["qty"]?.message)}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Weight</label>
                    <input
                        {...register("weight", {
                            required: "Weight is required.",
                            min: { value: 0, message: "Weight cannot be negative." },
                        })}
                        type="number"
                        value={formData.weight || 0}
                        onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />
                    {errors["weight"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["weight"]?.message)}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Production Lost</label>
                    <input
                        {...register("productionLost", {
                            required: "Production lost is required.",
                            min: { value: 0, message: "Production lost cannot be negative." },
                        })}
                        type="number"
                        value={formData.productionLost || 0}
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">₦ Cost</label>
                    <input
                        {...register("cost", {
                            required: "Cost is required.",
                            min: { value: 0, message: "Cost cannot be negative." },
                        })}
                        type="number"
                        value={formData.cost ?? 0}
                        onChange={(e) => handleChange("cost", parseFloat(e.target.value))}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />
                    {errors["cost"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["cost"]?.message)}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Average Cost (auto)</label>
                    <input
                        {...register("avgCost", {
                            required: "Average cost is required.",
                            min: { value: 0, message: "Average cost cannot be negative." },
                        })}
                        type="number"
                        value={formData.avgCost|| 0}
                        readOnly={true}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />
                    {errors["avgCost"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["avgCost"]?.message)}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Average Weight Per UoM (auto)</label>
                    <input
                        {...register("avgWeightPerUOM", {
                            required: "Average weight per UoM is required.",
                            min: { value: 0, message: "Average weight per UoM cannot be negative." },
                        })}
                        readOnly={true}
                        type="number"
                        value={formData.avgWeightPerUOM || 0}
                        className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                    />
                    {errors["avgWeightPerUOM"] && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>{String(errors["avgWeightPerUOM"]?.message)}</p>
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
