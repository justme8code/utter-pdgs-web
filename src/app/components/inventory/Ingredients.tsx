'use client';
import React, {useEffect, useState} from "react";
import {TextField} from "@/app/components/TextField";
import {addNewIngredient, deleteIngredient, getAllIngredients, updateIngredient,} from "@/app/actions/inventory";
import {RefreshCcw, Trash} from "lucide-react";
import {SelectableRawMaterials} from "@/app/components/inventory/SelectableRawMaterials";
import Loading from "@/app/loading";
import {Ingredient, RawMaterial} from "@/app/types";

export const Ingredients: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllIngredients();
                if (status) {
                    setIngredients(data || []);
                }
            } catch (error) {
                console.error("Failed to load ingredients:", error);
                setError("Failed to load ingredients. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "" }]);
    };

    const updateTextField = (index: number, value: string) => {
        setIngredients(ingredients.map((i, idx) => (idx === index ? { ...i, name: value } : i)));
    };

    const addSelectedRawMaterials = (index: number, rawMaterials: RawMaterial[]) => {
        setIngredients(ingredients.map((i, idx) => (idx === index ? { ...i, rawMaterials } : i)));
    };

    const updateIng = async (index: number, rawMaterials: RawMaterial[]) => {
        const ing = { ...ingredients[index], rawMaterials };
        if (ing.id) {
            try {
                const { data, status } = await updateIngredient(ing);
                if (status) {
                    const updatedIngredients = [...ingredients];
                    updatedIngredients[index] = data;
                    setIngredients(updatedIngredients);
                    setSuccess("Ingredient updated successfully!");
                    setTimeout(()=>{
                        setSuccess(null);
                    },1000)
                } else {
                    setError("Unable to update ingredient. Please try again.");
                    setTimeout(()=>{
                        setError(null);
                    },1000)
                }
            } catch (error:unknown) {
                console.log(error);
                setError("Unable to update ingredient. Please try again.");
                setTimeout(()=>{
                    setError(null);
                },1000)
            }
        }
    };

    const handleDelete = async (id:number|undefined)=>{
        if(id && id>0){
            const {status} = await deleteIngredient(id);
            if(status) {

                setSuccess("Ingredient deleted successfully!");
                setIngredients(prevState => prevState.filter(i => i.id !== id));
                setTimeout(()=>{
                    setSuccess(null);
                },1000);

            }else{
                setError("Ingredient could not be deleted!");
                setTimeout(()=>{
                    setError(null);
                },1000);
            }
        }else{
            setError("Ingredient could not be deleted!");
            setTimeout(()=>{
                setError(null);
            },1000)
        }
    }
    const saveMaterials = async () => {
        const newIngredients = ingredients.filter(m => !m.id);
        if (newIngredients.length === 0) return;

        setLoading(true);
        try {
            const { data, status } = await addNewIngredient(newIngredients);
            if (status) {
                setIngredients(data);
                setSuccess("New ingredient saved successfully!");
                setTimeout(()=>{
                    setSuccess(null);
                },1000);
            } else {
                setError("Oops! The new ingredient wasn't added. Please try again.");
            }
        } catch (error:unknown) {
            console.log(error);
            setError("Oops! The new ingredient wasn't added. Please try again.");
            setTimeout(()=>{
                setError(null);
            },1000)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"w-full"}>
            {loading ? <Loading/> :(
                <div className="w-full shadow-xs p-5 hover:shadow-sm">
                    <div className="flex w-full gap-10 mb-5 justify-end">

                        <div className="flex gap-5">
                            <button
                                onClick={addIngredient}
                                className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-sm"
                            >
                                <p>Add New Ingredient</p>
                            </button>
                            <button
                                onClick={saveMaterials}
                                className="bg-green-500 text-white px-4 py-1 rounded-sm disabled:bg-gray-400"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Ingredient"}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 font-bold">{error}</p>}
                    {success && <p className="text-green-500 font-bold">{success}</p>}
                    <table className="w-full border-collapse border border-gray-300 relative">
                        <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border-b border-l w-1/4 border-gray-300">Name</th>
                            <th className="p-2 border-b border-l w-full border-gray-300">Raw Materials Used</th>
                            <th className="p-2 border-b border-l w-full border-gray-300">Unit</th>
                            <th className="p-2 border-b border-l text-center border-gray-300">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ingredients.map((ingredient, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="p-2 border border-gray-300">
                                    <TextField
                                        value={ingredient.name}
                                        onChange={value => updateTextField(index, value)}
                                        props={{ placeholder: "Enter ingredient name" }}
                                    />
                                </td>
                                <td className="p-2 border border-gray-300 overflow-x-auto ">
                                    <div className="flex ">
                                        {ingredient.rawMaterials && ingredient.rawMaterials.length > 0 ? (
                                            <div className="flex gap-2 w-full scrollbar-thin scrollbar-thumb-gray-300">
                                                {ingredient.rawMaterials.map(rawMaterial => (
                                                    <span key={rawMaterial.id} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                                    {rawMaterial.name}
                                                </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">No Raw Material Used</span>
                                        )}
                                        <SelectableRawMaterials
                                            onSelectedRawMaterials={rawMaterials => addSelectedRawMaterials(index, rawMaterials)}
                                            alreadySelectedRawMaterials={ingredient.rawMaterials ?? []}
                                        />
                                    </div>
                                </td>

                                <td className="p-2 border border-gray-300 overflow-x-auto max-w-lg whitespace-nowrap">

                                </td>

                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button
                                            title="Update"
                                            className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                            onClick={() => updateIng(index, ingredient.rawMaterials || [])}
                                        >
                                            <RefreshCcw/>
                                        </button>
                                        <button
                                            title="Delete"
                                            className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                            onClick={() => {
                                                 if(ingredient.id) {
                                                     handleDelete(ingredient.id)
                                                 }
                                            }}
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
            )}
        </div>
    );
};
