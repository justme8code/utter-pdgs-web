import React, { useEffect, useState } from "react";
import { ListIcon, Trash } from "lucide-react";
import { TextField } from "@/app/components/TextField";
import { IngredientAdder } from "./IngredientAdder"; // Import the new component
import {addNewMaterial, deleteMaterial, getAllMaterials, getAllMaterialsWithIngredients} from "@/app/inventory/actions";

interface Material {
    id?: number;
    name: string;
    ingredients:{id:number,name:string}[]
}



export const RawMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllMaterialsWithIngredients();
                if (status) {
                    setMaterials(data);
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
        setMaterials([...materials, { name: "", ingredients: [] }]);
    };

    const updateMaterialName = (index: number, name: string) => {
        setMaterials(materials.map((m, i) => (i === index ? { ...m, name } : m)));
    };

   /* const updateMaterialIngredients = (index: number, newIngredients: string[]) => {
        setMaterials(materials.map((m, i) => (i === index ? { ...m, ingredients: newIngredients } : m)));
    };*/

    const removeMaterial = async (index: number) => {
        const material = materials[index];

        if (material.id) {
            const { status } = await deleteMaterial(material.id);
            if (status) {
                setMaterials(materials.filter((_, i) => i !== index));
            }
        } else {
            setMaterials(materials.filter((_, i) => i !== index));
        }
    };

    const saveMaterials = async () => {
        const newMaterials = materials.filter(m => !m.id);
        if (newMaterials.length === 0) return;

        setLoading(true);
        try {
            const formattedNewMaterials = newMaterials.map(m => ({ ...m, ingredients: m.ingredients.join(',') }));
            const { status } = await addNewMaterial(formattedNewMaterials);
            if (status) {
                const { data, status } = await getAllMaterials();
                if (status) {
                    const formattedData = data ? data.map(m => ({ ...m, ingredients: m.ingredients || [] })) : [];
                    setMaterials(formattedData);
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
                    <th className="p-2 border-b border-gray-300">RawMaterials</th>
                    <th className="p-2 border-b border-gray-300">Actions</th>
                </tr>
                </thead>
                <tbody>
                {materials.map((material, index) => (
                    <tr key={index} className="border-b border-gray-300">
                        <td className="p-2 border border-gray-300 ">
                             <div className={"space-y-5"}>
                                 <TextField
                                     value={material.name}
                                     onChange={value => updateMaterialName(index, value)}
                                     props={{
                                         placeholder: "Enter material name",
                                     }}
                                 />

                                {/* <IngredientAdder
                                     ingredients={material.ingredients}
                                     onIngredientsChange={(newIngredients) => updateMaterialIngredients(index, newIngredients)}
                                 />*/}
                             </div>
                        </td>

                        <td className="p-2 relative">
                            <button
                                className="bg-gray-200 absolute top-2 left-6 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
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