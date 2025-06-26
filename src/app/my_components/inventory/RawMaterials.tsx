// app/your-path/RawMaterials.tsx
'use client';
import React, {useCallback, useEffect, useState} from "react";
import {addNewMaterial, deleteMaterial, getAllRawMaterials,} from "@/api/inventory"; // Assuming correct path
import {AlertTriangle, CheckCircle2, ListPlus, Loader2, Package, Save, Scale, Trash2} from "lucide-react";
import {RawMaterial} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useUomStore} from "@/app/store/uomStore";
// Optional: For Toasts (npm install sonner)
// import { toast } from "sonner";

interface EditableRawMaterial extends RawMaterial {
    isNew?: boolean;
    isLoading?: boolean;
    // Add local error/success for individual card if needed
    // localError?: string | null;
    // localSuccess?: string | null;
}

export const RawMaterials: React.FC = () => {
    const [rawMaterials, setRawMaterials] = useState<EditableRawMaterial[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
    const [isSavingAll, setIsSavingAll] = useState(false);
    const {uoms, fetchUoms} = useUomStore();

    const fetchRawMaterials = useCallback(async () => {

        if (uoms.length === 0) {
            fetchUoms();
        }
        setPageLoading(true);
        setGlobalError(null);
        try {
            const {data, status} = await getAllRawMaterials();
            if (status && data) {
                setRawMaterials(data.map(rm => ({...rm, isNew: false, isLoading: false})));
            } else {
                setRawMaterials([]);
                setGlobalError("Failed to load raw materials. The server might be down or returned no data.");
            }
        } catch (error) {
            console.error("Failed to load raw materials:", error);
            setRawMaterials([]);
            setGlobalError("An unexpected error occurred while loading raw materials. Please try again.");
        } finally {
            setPageLoading(false);
        }
    }, [fetchUoms, uoms.length]);


    useEffect(() => {
        fetchRawMaterials();
    }, [fetchRawMaterials]);

    const displayTemporaryMessage = (setter: React.Dispatch<React.SetStateAction<string | null>>, message: string, duration: number = 3000) => {
        setter(message);
        setTimeout(() => setter(null), duration);
        // Example with toast:
        // if (setter === setGlobalSuccess) toast.success(message);
        // else if (setter === setGlobalError) toast.error(message);
    };

    const addMaterialRow = () => {
        setRawMaterials(prev => [...prev, {name: "", uom: "", isNew: true, isLoading: false}]);
    };

    const updateMaterialField = (index: number, field: keyof EditableRawMaterial, value: string) => {
        setRawMaterials(prev => prev.map((m, idx) => (idx === index ? {...m, [field]: value} : m)));
    };

    // IMPORTANT: You will likely need an `updateMaterial` action in your backend/API
    // similar to `updateIngredient`. The current `addNewMaterial` in your code seems to expect
    // an array and might be intended for bulk adding new items, not updating existing ones.
    const handleSaveOrUpdateMaterial = async (index: number) => {
        const materialToSave = rawMaterials[index];
        if (!materialToSave.name.trim() || !materialToSave.uom?.trim()) {
            displayTemporaryMessage(setGlobalError, "Material name and UoM cannot be empty.");
            return;
        }

        setRawMaterials(prev => prev.map((m, idx) => idx === index ? {...m, isLoading: true} : m));
        setGlobalError(null);
        setGlobalSuccess(null);

        try {
            if (materialToSave.id) { // Update existing
                // const { data, status } = await updateMaterial(materialToSave); // <-- YOU NEED THIS ACTION
                // For now, let's simulate success for UI demonstration if updateMaterial doesn't exist
                // Replace this with your actual updateMaterial call
                console.warn("`updateMaterial` action not implemented. Simulating update for UI.");
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
                const status = true; // Simulate success
                const data = materialToSave; // Simulate returned data

                if (status && data) {
                    setRawMaterials(prev => prev.map((m, idx) => idx === index ? {
                        ...data,
                        isNew: false,
                        isLoading: false
                    } : m));
                    displayTemporaryMessage(setGlobalSuccess, "Raw material updated successfully!");
                } else {
                    displayTemporaryMessage(setGlobalError, "Failed to update raw material.");
                }
            } else { // Save new (individual save)
                const {data, status} = await addNewMaterial([materialToSave]);
                if (status && data && data.length > 0) {
                    setRawMaterials(prev => prev.map((m, idx) => idx === index ? {
                        ...data[0],
                        isNew: false,
                        isLoading: false
                    } : m));
                    displayTemporaryMessage(setGlobalSuccess, "Raw material saved successfully!");
                } else {
                    displayTemporaryMessage(setGlobalError, "Failed to save new raw material.");
                }
            }
        } catch (error) {
            console.error("Error saving/updating raw material:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred.");
        } finally {
            await fetchRawMaterials();
        }
    };

    const handleDeleteMaterial = async (index: number) => {
        const materialToDelete = rawMaterials[index];
        setGlobalError(null);
        setGlobalSuccess(null);

        if (materialToDelete.isNew || !materialToDelete.id) {
            setRawMaterials(prev => prev.filter((_, idx) => idx !== index));
            displayTemporaryMessage(setGlobalSuccess, "Unsaved raw material row removed.");
            return;
        }

        setRawMaterials(prev => prev.map((m, idx) => idx === index ? {...m, isLoading: true} : m));
        try {
            const {status} = await deleteMaterial(materialToDelete.id);
            if (status) {
                setRawMaterials(prev => prev.filter((_, idx) => idx !== index));
                displayTemporaryMessage(setGlobalSuccess, "Raw material deleted successfully!");
            } else {
                displayTemporaryMessage(setGlobalError, "Failed to delete raw material.");
            }
        } catch (error) {
            console.error("Error deleting raw material:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred while deleting.");
        } finally {
            setRawMaterials(prev => prev.map((m, idx) => {
                if (idx === index && m) {
                    return {...m, isLoading: false};
                }
                return m;
            }).filter(Boolean) as EditableRawMaterial[]);
        }
    };

    const handleSaveAllNewMaterials = async () => {
        const newMaterialsToSave = rawMaterials.filter(m => m.isNew && m.name.trim() && m.uom?.trim());
        if (newMaterialsToSave.length === 0) {
            displayTemporaryMessage(setGlobalSuccess, "No new raw materials to save.");
            return;
        }
        setIsSavingAll(true);
        setGlobalError(null);
        setGlobalSuccess(null);
        try {
            // Your current `addNewMaterial` takes the whole `rawMaterials` array.
            // It should ideally take only the *new* ones or your backend should differentiate.
            // For now, sending only new ones.
            const {data, status} = await addNewMaterial(newMaterialsToSave);
            if (status && data) {
                await fetchRawMaterials(); // Refresh list to get all IDs and sync state
                displayTemporaryMessage(setGlobalSuccess, `${data.length} new raw material(s) saved successfully!`);
            } else {
                displayTemporaryMessage(setGlobalError, "Failed to save new raw materials.");
            }
        } catch (error) {
            console.error("Error saving all new raw materials:", error);
            displayTemporaryMessage(setGlobalError, "An error occurred while saving new raw materials.");
        } finally {
            setIsSavingAll(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] w-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">Loading Raw Materials...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Package className="h-6 w-6 text-primary"/>
                                Manage Raw Materials
                            </CardTitle>
                            <CardDescription>Add, edit, and manage raw materials for your inventory.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={addMaterialRow}>
                                <ListPlus className="mr-2 h-4 w-4"/> Add Material Row
                            </Button>
                            <Button
                                onClick={handleSaveAllNewMaterials}
                                disabled={isSavingAll || !rawMaterials.some(m => m.isNew && m.name.trim() && m.uom?.trim())}
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

                    {rawMaterials.length === 0 && !pageLoading && (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground"/>
                            <h3 className="mt-2 text-lg font-medium text-muted-foreground">No Raw Materials Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Get started by adding a new raw material.
                            </p>
                        </div>
                    )}

                    {rawMaterials.map((material, index) => (
                        <Card
                            key={material.id || `new-${index}`}
                            className={`
                                ${material.isNew ? 'border-blue-500 border-2' : 'border'}
                                ${material.isLoading ? 'opacity-70 pointer-events-none' : ''}
                            `}
                        >
                            <CardContent className="pt-6 pb-4"> {/* Adjusted padding */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                                    <div className="flex-grow space-y-1 w-full sm:w-auto">
                                        <label htmlFor={`name-${index}`}
                                               className="text-xs font-medium text-muted-foreground">Name</label>
                                        <Input
                                            id={`name-${index}`}
                                            placeholder="Enter material name"
                                            value={material.name}
                                            onChange={(e) => updateMaterialField(index, "name", e.target.value)}
                                            className="text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Unit of
                                            measurement</label>
                                        <Select onValueChange={value => {
                                            updateMaterialField(index, "uom", value);
                                        }} defaultValue={material.uom}>
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
                                    <div className="flex gap-2 pt-2 sm:pt-0 self-end sm:self-end"> {/* Align buttons */}
                                        {(material.isNew || material.id) && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleSaveOrUpdateMaterial(index)}
                                                disabled={material.isLoading || !material.name.trim() || !material.uom?.trim()}
                                                title={material.id ? "Update Material" : "Save New Material"}
                                            >
                                                {material.isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                    <Save className="h-4 w-4 text-blue-600"/>}
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteMaterial(index)}
                                            disabled={material.isLoading}
                                            title="Delete Material"
                                        >
                                            {material.isLoading && material.id ?
                                                <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Trash2 className="h-4 w-4 text-destructive"/>}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};