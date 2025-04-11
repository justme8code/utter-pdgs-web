'use client';
import React, { useEffect, useState } from "react";
import { TextField } from "@/app/components/TextField";
import {addNewMaterial, deleteMaterial, getAllRawMaterials} from "@/app/actions/inventory";
import { RefreshCcw, Trash } from "lucide-react";

export interface RawMaterial {
    id?: number;
    name: string;
    ingredients?: Ingredient[];
}

export interface Ingredient {
    id?: number;
    name: string;
    rawMaterials?: RawMaterial[];
}

export const RawMaterials: React.FC = () => {
    const [rawMaterials, setRawMaterials] = useState<{ id?: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllRawMaterials();
                if (status) {
                    setRawMaterials(data || []);
                }
            } catch (error) {
                console.error("Failed to load rawMaterials:", error);
                setError("Failed to load rawMaterials. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const addMaterial = () => {
        setRawMaterials([...rawMaterials, { name: "" }]);
    };

    const updateTextField = (index: number, value: string) => {
        setRawMaterials(rawMaterials.map((m, idx) => (idx === index ? { ...m, name: value } : m)));
    };

    const saveMaterials = async () => {
        const newMaterials = rawMaterials.filter(m => !m.id);
        if (newMaterials.length === 0) return;

        setLoading(true);
        try {
            const { data, status } = await addNewMaterial(newMaterials);
            if (status && data) {
                setRawMaterials(data);
                setSuccess("New material saved successfully!");
            } else {
                setError("Oops! The new material wasn't added. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setError("Oops! The new material wasn't added. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const removeMaterial = async (index:number) => {
        const rawMaterial = rawMaterials[index];
        if(rawMaterial.id){
            setLoading(true);

            try {
                const { status } = await deleteMaterial(rawMaterial.id);
                if (status) {
                    setRawMaterials(rawMaterials.filter(m => m.id !== rawMaterial.id));
                    setSuccess("Material deleted successfully!");
                } else {
                    setError("Failed to delete rawMaterial. Please try again.");
                }
            } catch (error) {
                console.error(error);
                setError("Failed to delete rawMaterial. Please try again.");
            } finally {
                setLoading(false);
            }
        }else{
            setRawMaterials(rawMaterials.filter((_, i) => i !== index));
        }

    };

    return (
        <div className="w-full shadow-xs p-5 hover:shadow-xl">
            <div className="flex w-full gap-10 mb-5 justify-between">
                <h2 className="text-xl font-bold">Raw Materials</h2>
                <div className="flex gap-5">
                    <button
                        onClick={addMaterial}
                        className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-xs"
                    >
                        <p>Add New Material</p>
                    </button>
                    <button
                        onClick={saveMaterials}
                        className="bg-green-500 text-white px-4 py-1 rounded-xs disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Material"}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 font-bold">{error}</p>}
            {success && <p className="text-green-500 font-bold">{success}</p>}
            <table className="w-full border-collapse border border-gray-300 relative">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="p-2 border-b border-l w-3/4 border-gray-300">Name</th>
                    <th className="p-2 border-b border-l text-center border-gray-300">Actions</th>
                </tr>
                </thead>
                <tbody>
                {rawMaterials.map((material, index) => (
                    <tr key={index} className="border-b border-gray-300">
                        <td className="p-2 border border-gray-300">
                            <TextField
                                value={material.name}
                                onChange={value => updateTextField(index, value)}
                                props={{ placeholder: "Enter material name" }}
                            />
                        </td>
                        <td className="p-2">
                            <div className="flex gap-2 justify-center">
                                <button
                                    title="Delete"
                                    className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                    onClick={() => removeMaterial(index)}
                                >
                                    <Trash />
                                </button>


                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};