// app/your-path/Ingredients.tsx
'use client';
import React, {useCallback, useEffect, useState} from "react";
import {addNewIngredient, deleteIngredient, getAllIngredients, updateIngredient,} from "@/api/inventory"; // Assuming correct path
import {AlertTriangle, CheckCircle2, FlaskConical, ListPlus, Loader2, Save, Scale, Trash2} from "lucide-react";
import {SelectableRawMaterials} from "@/app/my_components/inventory/SelectableRawMaterials"; // Keep your component
import {Ingredient, RawMaterial} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useUomStore} from "@/app/store/uomStore";


interface EditableIngredient extends Ingredient {
    isNew?: boolean; // Flag for newly added unsaved items
    isLoading?: boolean; // For individual item loading state
}

export const Ingredients: React.FC = () => {
    const [ingredients, setIngredients] = useState<EditableIngredient[]>([]);
    const [pageLoading, setPageLoading] = useState(true); // For initial page load
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
    const [isSavingAll, setIsSavingAll] = useState(false);
    const {fetchUoms, uoms} = useUomStore();

    const fetchIngredients = useCallback(async () => {
        setPageLoading(true);
        setGlobalError(null);
        try {
            const {data, status} = await getAllIngredients();
            if (status && data) {
                setIngredients(data.map(ing => ({...ing, isNew: false, isLoading: false})));
            } else {
                setIngredients([]);
                setGlobalError("Failed to load ingredients. The server might be down or returned no data.");
            }
        } catch (error) {
            console.error("Failed to load ingredients:", error);
            setIngredients([]);
            setGlobalError("An unexpected error occurred while loading ingredients. Please try again.");
        } finally {
            setPageLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchIngredients();
        fetchUoms();
    }, [fetchIngredients, fetchUoms]);

    const displayTemporaryMessage = (setter: React.Dispatch<React.SetStateAction<string | null>>, message: string) => {
        setter(message);
        setTimeout(() => setter(null), 3000);
        // Or use toast: toast.success(message) or toast.error(message)
    };

    const addIngredientRow = () => {
        setIngredients(prev => [...prev, {name: "", rawMaterials: [], uom: "", isNew: true, isLoading: false}]);
    };

    const updateIngredientName = (index: number, name: string) => {
        setIngredients(prev => prev.map((ing, idx) => (idx === index ? {...ing, name} : ing)));
    };

    const updateIngredientUom = (index: number, uom: string) => {
        setIngredients(prev => prev.map((ing, idx) => (idx === index ? {...ing, uom} : ing)));
    }

    const updateIngredientRawMaterials = (index: number, rawMaterials: RawMaterial[]) => {
        setIngredients(prev => prev.map((ing, idx) => (idx === index ? {...ing, rawMaterials} : ing)));
    };

    const handleSaveOrUpdateIngredient = async (index: number) => {
        const ingredientToSave = ingredients[index];
        if (!ingredientToSave.name.trim()) {
            displayTemporaryMessage(setGlobalError, "Ingredient name cannot be empty.");
            return;
        }

        setIngredients(prev => prev.map((ing, idx) => idx === index ? {...ing, isLoading: true} : ing));
        setGlobalError(null);
        setGlobalSuccess(null);

        try {
            if (ingredientToSave.id) { // Update existing
                const {data, status} = await updateIngredient(ingredientToSave);
                if (status && data) {
                    setIngredients(prev => prev.map((ing, idx) => idx === index ? {
                        ...data,
                        isNew: false,
                        isLoading: false
                    } : ing));
                    displayTemporaryMessage(setGlobalSuccess, "Ingredient updated successfully!");
                } else {
                    displayTemporaryMessage(setGlobalError, "Failed to update ingredient.");
                }
            } else { // Save new
                const {data, status} = await addNewIngredient([ingredientToSave]); // Assuming addNewIngredient can take a single new item in an array
                if (status && data) {
                    await fetchIngredients();
                    displayTemporaryMessage(setGlobalSuccess, "Ingredient saved successfully!");
                } else {
                    displayTemporaryMessage(setGlobalError, "Failed to save new ingredient.");
                }
            }
        } catch (error) {
            console.error("Error saving/updating ingredient:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred.");
        } finally {
            setIngredients(prev => prev.map((ing, idx) => idx === index ? {...ing, isLoading: false} : ing));
        }
    };


    const handleDeleteIngredient = async (index: number) => {
        const ingredientToDelete = ingredients[index];
        setGlobalError(null);
        setGlobalSuccess(null);

        if (ingredientToDelete.isNew || !ingredientToDelete.id) { // If it's a new, unsaved row
            setIngredients(prev => prev.filter((_, idx) => idx !== index));
            displayTemporaryMessage(setGlobalSuccess, "Unsaved ingredient row removed.");
            return;
        }

        setIngredients(prev => prev.map((ing, idx) => idx === index ? {...ing, isLoading: true} : ing));
        try {
            const {status} = await deleteIngredient(ingredientToDelete.id);
            if (status) {
                setIngredients(prev => prev.filter((_, idx) => idx !== index));
                displayTemporaryMessage(setGlobalSuccess, "Ingredient deleted successfully!");
            } else {
                displayTemporaryMessage(setGlobalError, "Failed to delete ingredient.");
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred while deleting.");
        } finally {
            setIngredients(prev => prev.map((ing, idx) => {
                if (idx === index && ing) { // Check if 'ing' still exists (it shouldn't if successfully deleted)
                    return {...ing, isLoading: false};
                }
                return ing;
            }).filter(Boolean) as EditableIngredient[]); // Filter out undefined if item was removed
        }
    };

    const handleSaveAllNewIngredients = async () => {
        const newIngredientsToSave = ingredients.filter(ing => ing.isNew && ing.name.trim());
        if (newIngredientsToSave.length === 0) {
            displayTemporaryMessage(setGlobalSuccess, "No new ingredients to save.");
            return;
        }
        setIsSavingAll(true);
        setGlobalError(null);
        setGlobalSuccess(null);
        try {
            const {data, status} = await addNewIngredient(newIngredientsToSave);
            if (status && data) {
                // Refresh all ingredients from backend or smartly merge
                await fetchIngredients(); // Simplest way to get all IDs and sync state
                displayTemporaryMessage(setGlobalSuccess, `${data.length} new ingredient(s) saved successfully!`);
            } else {
                displayTemporaryMessage(setGlobalError, "Failed to save new ingredients.");
            }
        } catch (error) {
            console.error("Error saving all new ingredients:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred while saving new ingredients.");
        } finally {
            setIsSavingAll(false);
        }
    };


    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FlaskConical className="h-6 w-6 text-primary"/>
                                Manage Ingredients
                            </CardTitle>
                            <CardDescription>Add, edit, and manage product ingredients and their raw
                                materials.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={addIngredientRow}>
                                <ListPlus className="mr-2 h-4 w-4"/> Add Ingredient Row
                            </Button>
                            <Button
                                onClick={handleSaveAllNewIngredients}
                                disabled={isSavingAll || !ingredients.some(ing => ing.isNew && ing.name.trim())}
                            >
                                {isSavingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                                    <Save className="mr-2 h-4 w-4"/>}
                                Save All New
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {globalError && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{globalError}</AlertDescription>
                        </Alert>
                    )}
                    {globalSuccess && (
                        <Alert variant="default"
                               className="bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4"/>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{globalSuccess}</AlertDescription>
                        </Alert>
                    )}

                    {ingredients.length === 0 && !pageLoading && (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <FlaskConical className="mx-auto h-12 w-12 text-muted-foreground"/>
                            <h3 className="mt-2 text-lg font-medium text-muted-foreground">No Ingredients Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Get started by adding a new ingredient.
                            </p>
                        </div>
                    )}

                    {ingredients.map((ingredient, index) => (
                        <Card key={ingredient.id || `new-${index}`} className={`
                            ${ingredient.isNew ? 'border-blue-500 border-2' : 'border'}
                            ${ingredient.isLoading ? 'opacity-70 pointer-events-none' : ''}
                        `}>
                            <CardHeader className="pb-3 pt-4">
                                <div className="flex justify-between items-center">
                                    <Input
                                        placeholder="Enter ingredient name"
                                        value={ingredient.name}
                                        onChange={(e) => updateIngredientName(index, e.target.value)}
                                        className="text-lg font-semibold flex-grow mr-4 !border-0 !shadow-none !ring-0 p-0 focus-visible:!ring-0 focus-visible:!border-b"
                                    />
                                    <div className="flex gap-2">
                                        {(ingredient.isNew || ingredient.id) && ( // Show save/update only if it's new or has an ID
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleSaveOrUpdateIngredient(index)}
                                                disabled={ingredient.isLoading || !ingredient.name.trim()}
                                                title={ingredient.id ? "Update Ingredient" : "Save New Ingredient"}
                                            >
                                                {ingredient.isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                    <Save className="h-4 w-4 text-blue-600"/>}
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteIngredient(index)}
                                            disabled={ingredient.isLoading}
                                            title="Delete Ingredient"
                                        >
                                            {ingredient.isLoading && ingredient.id ?
                                                <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Trash2 className="h-4 w-4 text-destructive"/>}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Raw Materials
                                        Used</label>
                                    <div
                                        className="flex items-center gap-2 mt-1 flex-wrap p-2 border rounded-md min-h-[40px]">
                                        {ingredient.rawMaterials && ingredient.rawMaterials.length > 0 ? (
                                            ingredient.rawMaterials.map(rm => (
                                                <Badge key={rm.id} variant="secondary">{rm.name}</Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">None selected</span>
                                        )}
                                        <SelectableRawMaterials // Your existing component
                                            onSelectedRawMaterials={rms => updateIngredientRawMaterials(index, rms)}
                                            alreadySelectedRawMaterials={ingredient.rawMaterials ?? []}
                                            // Consider adding a trigger prop for custom styling if needed:
                                            // trigger={<Button variant="outline" size="xs"><PlusCircle className="h-3 w-3"/> Add</Button>}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Unit of
                                        measurement</label>
                                    <Select onValueChange={value => updateIngredientUom(index, value)}
                                            defaultValue={ingredient.uom}>
                                        <SelectTrigger
                                            className="h-8 w-[140px] px-2 py-1 text-xs font-medium text-black tracking-tight">
                                            <Scale className="h-5 w-5 mr-1 text-black"/>
                                            <SelectValue placeholder="UOM"/>
                                        </SelectTrigger>
                                        <SelectContent className="text-sm">
                                            {uoms.map((uom) => (
                                                <SelectItem
                                                    value={uom.abbrev}
                                                    key={uom.id}
                                                    className="text-center text-sm text-muted-foreground py-1"
                                                >
                                                    {uom.abbrev}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Add UoM field if needed */}
                                {/* <div>
                                    <label className="text-xs font-medium text-muted-foreground">Unit of Measure</label>
                                    <Input placeholder="e.g., Litres, Kg" value={ingredient.uom || ""} onChange={(e) => updateIngredientUoM(index, e.target.value)} />
                                </div> */}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};