import React, { useEffect, useState } from "react";
import {  Trash } from "lucide-react";
import { TextField } from "@/app/components/TextField";
import { IngredientAdder } from "./IngredientAdder"; // Import the new component
import {
    addIngredientsToRawMaterial,
    addNewMaterial,
    deleteMaterial,
    getAllMaterialsWithIngredients
} from "@/app/inventory/actions";
import {SelectableIngredients} from "@/app/inventory/SelectableIngredients";
import Loading from "@/app/loading";

export interface RawMaterial {
    id?: number;
    name: string;
    ingredients:Ingredient[];
}

export interface Ingredient {
    id?: number;
    name: string;
    createdAt:string;
}


export const RawMaterials: React.FC = () => {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [updateMessage, setUpdateMessage] = useState<string|null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllMaterialsWithIngredients();
                if (status) {
                    setRawMaterials(data);
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
        setRawMaterials([...rawMaterials, { name: "", ingredients: [] }]);
    };

    const updateMaterialName = (index: number, name: string) => {
        setRawMaterials(rawMaterials.map((m, i) => (i === index ? { ...m, name } : m)));
    };

    const updateMaterialIngredients = (index: number, newIngredients: Ingredient[]) => {
        setRawMaterials(rawMaterials.map((rawMaterial, idx) =>
            (idx=== index ? {...rawMaterial,ingredients:newIngredients}:rawMaterial)))
    };

    const addIngredientToRM = async (index:number)=>{
        setLoading(true);
        const rm = rawMaterials[index];
        if(rm.id){
            console.log(rm.ingredients);
            const {status} = await addIngredientsToRawMaterial(rm.id,rm.ingredients);
            if(status){
                setUpdateMessage("Ingredients added successfully.");
            }else{
                setUpdateMessage("Could not add ingredients.");
            }
        }

        setLoading(false);
    }

    const removeMaterial = async (index: number) => {
        const material = rawMaterials[index];

        if (material.id) {
            const { status } = await deleteMaterial(material.id);
            if (status) {
                setRawMaterials(rawMaterials.filter((_, i) => i !== index));
            }
        } else {
            setRawMaterials(rawMaterials.filter((_, i) => i !== index));
        }
    };

    const saveMaterials = async () => {
        const newMaterials = rawMaterials.filter(m => !m.id);
        if (newMaterials.length === 0) return;

        console.log(newMaterials);
        const {data, status} = await addNewMaterial(newMaterials);
        console.log(status);
        if (status && data){
            setRawMaterials(data);
        }else{
            setTimeout(()=>{
                setError("Oops the new raw material wasn't added, I not sure why, but please try again.");
            },1000)
            setError(null);
        }
    };

    return (
        <div className="w-full max-h-screen overflow-scroll">
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

                {error && <p className={"text-red-500 font-bold"}>{error}</p>}
                {rawMaterials.map((rawMaterial, index) => (
                    <tr key={index} className="border-b border-gray-300">
                        <td className="p-2 border  w-full max-w-3/4 border-gray-300 ">
                             <div className={"space-y-2"}>
                                 {rawMaterial.id? <h1 className={"font-medium"}>{rawMaterial.name}</h1>
                                    : <TextField
                                         value={rawMaterial.name}
                                         onChange={value => updateMaterialName(index, value)}
                                         props={{
                                             placeholder: "Enter material name",
                                         }}
                                     />
                                 }
                                 <SelectableIngredients alreadySelectedIngredients={rawMaterial.ingredients} onSelectedIngredients={ingredients => updateMaterialIngredients(index, ingredients)}/>
                                 {
                                     rawMaterial.ingredients.length > 0 &&  <div className={"flex"}>
                                         {loading ? <Loading className={"w-6 h-6"}/> : <button onClick={() => addIngredientToRM(index)} className={"rounded-sm p-1 border-none ring-1 ring-gray-200 hover:bg-blue-500 cursor-pointer hover:text-white"}>update</button>}
                                     </div>
                                 }
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