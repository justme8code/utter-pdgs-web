'use client';
import React, { useEffect, useState } from "react";
import { getAllIngredients } from "@/app/actions/inventory";
import { Ingredient } from "@/app/components/inventory/RawMaterials";
import {ArrowDown, ArrowRight, ChevronDown, ChevronRight} from "lucide-react";

export const SelectableIngredients = ({
                                          alreadySelectedIngredients,
                                          onSelectedIngredients,
                                      }: {
    onSelectedIngredients: (ingredients: Ingredient[]) => void,
    alreadySelectedIngredients: Ingredient[]
}) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(alreadySelectedIngredients);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch ingredients on mount
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
                setError("Failed to load ingredients.");
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    // Only call onSelectedIngredients if the selection actually changes, Why?
    useEffect(() => {
        if (JSON.stringify(selectedIngredients) !== JSON.stringify(alreadySelectedIngredients)) {
            onSelectedIngredients(selectedIngredients);
        }
    }, [alreadySelectedIngredients, onSelectedIngredients, selectedIngredients]); // ✅ Only runs when selectedIngredients changes

    // Toggle ingredient selection
    const toggleSelection = (ingredient: Ingredient) => {
        setSelectedIngredients((prevSelected) => {
            if (prevSelected.some((i) => i.id === ingredient.id)) {
                return prevSelected.filter((i) => i.id !== ingredient.id);
            } else {
                return [...prevSelected, ingredient];
            }
        });
    };

    return (
        <div className="w-full space-y-3">
            <div className={"flex w-full justify-end"}>
                <button
                    className="flex justify-end text-sm text-gray-500 hover:text-gray-600 items-center transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <p>{isOpen ? "Hide Ingredients" : "Ingredients"}</p>
                    {isOpen ? (<ChevronDown size={20}/> ) : (<ChevronRight size={20}/>)}
                </button>
            </div>

            {isOpen && (
                <div className="">
                    {error && <p className="text-red-500">{error}</p>}

                    {loading ? (
                        <p>Loading ingredients...</p>
                    ) : (
                        <div className="flex gap-2 flex-wrap">
                            {ingredients.map((ingredient) => {
                                const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
                                return (
                                    <button
                                        key={ingredient.id}
                                        className={`cursor-pointer p-1  rounded-sm border ${
                                            isSelected ? "bg-gray-200 border-none" : "border-gray-100"
                                        }`}
                                        onClick={() => toggleSelection(ingredient)}
                                    >
                                        {ingredient.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
