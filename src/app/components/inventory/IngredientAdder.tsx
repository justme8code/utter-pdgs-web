'use client';
import React from "react";
import { Trash } from "lucide-react";
import { TextField } from "@/app/components/TextField";
import {Ingredient} from "@/app/components/inventory/RawMaterials";

interface IngredientAdderProps {
    ingredients: Ingredient[];
    onIngredientsChange: (newIngredients: Ingredient[]) => void;
}

export const IngredientAdder: React.FC<IngredientAdderProps> = ({ ingredients, onIngredientsChange }) => {

    const handleIngredientChange = (index: number, value:Ingredient) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        onIngredientsChange(newIngredients);
    };

    const addIngredient = () => {
        onIngredientsChange([...ingredients, {
            name:""
        }]);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        onIngredientsChange(newIngredients);
    };

    return (
        <div>
            <div>

                {ingredients && ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <TextField
                            value={ingredient.name}
                            onChange={value => handleIngredientChange(index, {name:value})}
                            props={{
                                placeholder: `Ingredient ${index + 1}`,
                             
                            }}
                        />
                        <button
                            className="bg-red-200 hover:text-white hover:bg-red-500 px-2 py-1 rounded-full hover:cursor-pointer"
                            onClick={() => removeIngredient(index)}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addIngredient}
                className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-sm mt-2"
            >
                Add Ingredient
            </button>
        </div>
    );
};