import React, { useEffect, useState } from "react";
import { ListIcon, Trash } from "lucide-react";
import { TextField } from "@/app/components/TextField";
import {addNewMaterial, deleteMaterial, getAllMaterials} from "@/app/inventory/actions";

interface Material {
    id?: number; // Optional, because new materials don't have an ID
    name: string;
}

export const RawMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch raw materials from the API on mount
    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllMaterials();
                if (status) {
                    setMaterials(data || []);
                }
            } catch (error) {
                console.error("Failed to load materials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const addMaterial = () => {
        setMaterials([...materials, { name: "" }]); // New materials have no ID
    };

    const updateMaterial = (index: number, value: string) => {
        setMaterials(materials.map((m, i) => (i === index ? { ...m, name: value } : m)));
    };

    const removeMaterial = async (index: number) => {
        const material = materials[index];

        if (material.id) {
            // If it has an ID, delete it from the API
            const { status } = await deleteMaterial(material.id);
            if (status) {
                setMaterials(materials.filter((_, i) => i !== index));
            }
        } else {
            // If no ID, it's a new material, just remove from UI
            setMaterials(materials.filter((_, i) => i !== index));
        }
    };

    const saveMaterials = async () => {
        const newMaterials = materials.filter(m => !m.id); // Only send new materials
        if (newMaterials.length === 0) return;

        setLoading(true);
        try {
            const { status } = await addNewMaterial(newMaterials);
            if (status) {
                const { data, status } = await getAllMaterials(); // Refresh materials list
                if (status) {
                    setMaterials(data || []);
                }
            }
        } catch (error) {
            console.error("Failed to save materials:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex w-full gap-10 mb-5">
                <h2 className="text-xl font-bold">Raw Materials</h2>
                <button
                    onClick={addMaterial}
                    className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-sm"
                >
                    <p>Add Raw Material</p>
                </button>
                <button
                    onClick={saveMaterials}
                    className="bg-green-500 text-white px-4 py-1 rounded-md disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Materials"}
                </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2 border-b border-gray-300">Name</th>
                    <th className="p-2 border-b border-gray-300">Actions</th>
                </tr>
                </thead>
                <tbody>
                {materials.map((material, index) => (
                    <tr key={index} className="border-b border-gray-300">
                        <td className="p-2 border border-gray-300">
                            <TextField
                                value={material.name}
                                onChange={value => updateMaterial(index, value)}
                                props={{
                                    placeholder: "Enter material name",
                                }}
                            />
                        </td>
                        <td className="p-2">
                            <button
                                className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                onClick={() => removeMaterial(index)}
                            >
                                <Trash />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
