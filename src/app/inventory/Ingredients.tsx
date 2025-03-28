import React, { useEffect, useState } from "react";
import { TextField } from "@/app/components/TextField";
import {
    addNewIngredient,
    getAllIngredients,
} from "@/app/inventory/actions";
import {Ingredient} from "@/app/inventory/RawMaterials";
import { Trash } from "lucide-react";



export const Ingredients: React.FC = () => {
    const [ingredient, setIngredient] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    // Fetch raw materials from the API on mount
    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllIngredients();
                if (status) {
                    setIngredient(data || []);
                }
            } catch (error) {
                console.error("Failed to load materials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    const addIngredient = () => {
        setIngredient([...ingredient, { name: "" }]); // New materials have no ID
    };

    const updateIngredient = (index: number, value: string) => {
        setIngredient(ingredient.map((m, i) => (i === index ? { ...m, name: value } : m)));
    };

   /* const removeIngredients = async (index: number) => {
        const material = ingredient[index];

        if (material.id) {
            // If it has an ID, delete it from the API
            const { status } = await deleteMaterial(material.id);
            if (status) {
                setIngredient(ingredient.filter((_, i) => i !== index));
            }
        } else {
            // If no ID, it's a new material, just remove from UI
            setIngredient(ingredient.filter((_, i) => i !== index));
        }
    };*/

    const saveMaterials = async () => {
        const ingredients = ingredient.filter(m => !m.id); // Only send new materials
        if (ingredients.length === 0) return;

        setLoading(true);
        const { data,status } = await addNewIngredient(ingredients);
        if (status && data){
            setIngredient(data);
        }else{
            setTimeout(()=>{
                setError("Oops the new raw material wasn't added, I not sure why, but please try again.");
            },1000)
            setError(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex w-full gap-10 mb-5">
                <h2 className="text-xl font-bold">Ingredients</h2>
                <button
                    onClick={addIngredient}
                    className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-sm"
                >
                    <p>Add New Ingredient</p>
                </button>
                <button
                    onClick={saveMaterials}
                    className="bg-green-500 text-white px-4 py-1 rounded-md disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Ingredient"}
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
                {error && <p className={"text-red-500 font-bold"}>{error}</p>}
                {ingredient.map((material, index) => (
                    <tr key={index} className="border-b border-gray-300">
                        <td className="p-2 border border-gray-300">
                            <TextField
                                value={material.name}
                                onChange={value => updateIngredient(index, value)}
                                props={{
                                    placeholder: "Enter material name",
                                }}
                            />
                        </td>
                        <td className="p-2">
                           {/* <button
                                className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                onClick={() => removeIngredients(index)}
                            >
                                <Trash />
                            </button>*/}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};