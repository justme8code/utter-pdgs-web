// app/my_components/inventory/SelectableRawMaterials.tsx
'use client'; // Ensure client component directive

import React, {useEffect, useMemo, useState} from "react";
import {getAllRawMaterials} from "@/api/inventory";
import {AlertTriangle, Check, Loader2, PlusCircle, X} from "lucide-react"; // Added icons
import {RawMaterial} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Checkbox} from "@/components/ui/checkbox"; // Shadcn Checkbox
import {ScrollArea} from "@/components/ui/scroll-area"; // For long lists
import {Input} from "@/components/ui/input"; // For optional search within popover
import {Separator} from "@/components/ui/separator";

interface SelectableRawMaterialsProps {
    onSelectedRawMaterials: (rawMaterials: RawMaterial[]) => void;
    alreadySelectedRawMaterials: RawMaterial[];
    trigger?: React.ReactNode; // Optional custom trigger
    align?: "start" | "center" | "end"; // Popover alignment
    side?: "top" | "right" | "bottom" | "left"; // Popover side
}

export const SelectableRawMaterials = ({
                                           onSelectedRawMaterials,
                                           alreadySelectedRawMaterials,
                                           trigger,
                                           align = "center",
                                           side = "bottom"
                                       }: SelectableRawMaterialsProps) => {
    const [allRawMaterials, setAllRawMaterials] = useState<RawMaterial[]>([]);
    // Internal state for managing selection within the popover before confirming
    const [currentSelection, setCurrentSelection] = useState<RawMaterial[]>(alreadySelectedRawMaterials);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch raw materials on component mount or when popover is about to open
    useEffect(() => {
        if (isOpen && allRawMaterials.length === 0 && !isLoading) { // Fetch only if needed and not already loading
            const fetchRawMaterials = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const {data, status} = await getAllRawMaterials();
                    if (status && data) {
                        setAllRawMaterials(data);
                    } else {
                        setError("Failed to load raw materials list.");
                    }
                } catch (err) {
                    console.error("Failed to load raw materials:", err);
                    setError("An error occurred while fetching raw materials.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRawMaterials();
        }
    }, [isOpen, allRawMaterials.length, isLoading]);

    // Sync internal `currentSelection` when `alreadySelectedRawMaterials` prop changes (e.g., from parent state)
    useEffect(() => {
        setCurrentSelection(alreadySelectedRawMaterials);
    }, [alreadySelectedRawMaterials]);


    const handleToggleSelection = (rawMaterial: RawMaterial) => {
        setCurrentSelection((prevSelected) => {
            const isCurrentlySelected = prevSelected.some((rm) => rm.id === rawMaterial.id);
            if (isCurrentlySelected) {
                return prevSelected.filter((rm) => rm.id !== rawMaterial.id);
            } else {
                return [...prevSelected, rawMaterial];
            }
        });
    };

    const handleApplySelection = () => {
        onSelectedRawMaterials(currentSelection);
        setIsOpen(false); // Close popover on apply
    };

    const handleCancel = () => {
        setCurrentSelection(alreadySelectedRawMaterials); // Reset to original selection
        setIsOpen(false);
    }

    const filteredRawMaterials = useMemo(() => {
        if (!searchTerm.trim()) {
            return allRawMaterials;
        }
        return allRawMaterials.filter(rm =>
            rm.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allRawMaterials, searchTerm]);

    const defaultTrigger = (
        <Button variant="outline" size="sm" className="text-xs h-7">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5"/>
            Manage Raw Materials
        </Button>
    );

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {trigger || defaultTrigger}
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-0" // Adjust width as needed, remove default padding
                align={align}
                side={side}
            >
                <div className="flex flex-col space-y-2">
                    <div className="p-4 pb-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold tracking-tight">Select Raw Materials</h3>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4"/>
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                        <Input
                            type="search"
                            placeholder="Search materials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>

                    <Separator/>

                    {isLoading && (
                        <div className="flex items-center justify-center h-32 p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                            <p className="ml-2 text-sm text-muted-foreground">Loading...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="p-4 text-center">
                            <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2"/>
                            <p className="text-sm font-medium text-destructive">Error Loading</p>
                            <p className="text-xs text-muted-foreground">{error}</p>
                            {/* Optionally add a retry button */}
                        </div>
                    )}
                    {!isLoading && !error && filteredRawMaterials.length === 0 && (
                        <p className="p-4 text-center text-sm text-muted-foreground">
                            {allRawMaterials.length === 0 ? "No raw materials available." : "No materials match your search."}
                        </p>
                    )}
                    {!isLoading && !error && filteredRawMaterials.length > 0 && (
                        <ScrollArea className="h-60 p-4 pt-0"> {/* Max height for scroll */}
                            <div className="space-y-2 py-2">
                                {filteredRawMaterials.map((rawMaterial) => {
                                    const isSelected = currentSelection.some((rm) => rm.id === rawMaterial.id);
                                    return (
                                        <label
                                            key={rawMaterial.id}
                                            htmlFor={`rm-${rawMaterial.id}`}
                                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                                        >
                                            <Checkbox
                                                id={`rm-${rawMaterial.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => handleToggleSelection(rawMaterial)}
                                            />
                                            <span>{rawMaterial.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}

                    {!isLoading && !error && allRawMaterials.length > 0 && (
                        <>
                            <Separator/>
                            <div className="flex justify-end gap-2 p-3 border-t">
                                <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                                <Button size="sm" onClick={handleApplySelection}>
                                    <Check className="mr-1.5 h-4 w-4"/> Apply
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};