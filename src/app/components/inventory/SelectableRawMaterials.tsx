
import React, { useEffect, useState, useRef } from "react";
import { RawMaterial } from "@/app/components/inventory/RawMaterials";
import {getAllRawMaterials} from "@/app/actions/inventory";
import {Plus} from "lucide-react";

export const SelectableRawMaterials = ({
                                           alreadySelectedRawMaterials,
                                           onSelectedRawMaterials,
                                       }: {
    onSelectedRawMaterials: (rawMaterials: RawMaterial[]) => void,
    alreadySelectedRawMaterials: RawMaterial[]
}) => {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [selectedRawMaterials, setSelectedRawMaterials] = useState<RawMaterial[]>(alreadySelectedRawMaterials);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    // Fetch raw materials on mount
    useEffect(() => {
        const fetchRawMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllRawMaterials();
                if (status) {
                    setRawMaterials(data || []);
                }
            } catch (error) {
                console.error("Failed to load raw materials:", error);
                setError("Failed to load raw materials.");
            } finally {
                setLoading(false);
            }
        };
        fetchRawMaterials();
    }, []);

    // Sync selection changes
    useEffect(() => {
        if (JSON.stringify(selectedRawMaterials) !== JSON.stringify(alreadySelectedRawMaterials)) {
            onSelectedRawMaterials(selectedRawMaterials);
        }
    }, [alreadySelectedRawMaterials, onSelectedRawMaterials, selectedRawMaterials]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Toggle raw material selection
    const toggleSelection = (rawMaterial: RawMaterial) => {
        setSelectedRawMaterials((prevSelected) => {
            if (prevSelected.some((rm) => rm.id === rawMaterial.id)) {
                return prevSelected.filter((rm) => rm.id !== rawMaterial.id);
            } else {
                return [...prevSelected, rawMaterial];
            }
        });
    };

    return (
        <div className="w-full space-y-3 ">
            <div className="flex w-full justify-end">
                <button
                    className="text-sm flex text-gray-500 hover:text-gray-600 items-center transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus/> <p>Raw Materials</p>
                </button>
            </div>

            {isOpen && (
                <div ref={popoverRef} className="absolute right-0 mt-2 bg-white p-5 rounded-lg shadow-lg w-64 border border-gray-300 z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Add Raw Materials</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {loading ? (
                        <p>Loading raw materials...</p>
                    ) : (
                        <div className="flex gap-2 flex-wrap">
                            {rawMaterials.map((rawMaterial) => {
                                const isSelected = selectedRawMaterials.some((rm) => rm.id === rawMaterial.id);
                                return (
                                    <label key={rawMaterial.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(rawMaterial)}
                                            className="cursor-pointer"
                                        />
                                        {rawMaterial.name}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};