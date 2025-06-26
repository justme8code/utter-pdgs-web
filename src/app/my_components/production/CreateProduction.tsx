// app/your-path/CreateProduction.tsx (or CreateProductionModal.tsx)
'use client';

import React, {useEffect, useState} from "react";
import {createProduction} from "@/api/production"; // Assuming correct path
import {useRouter} from "next/navigation";

import {Button as ShadcnButton} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input as ShadcnInput} from "@/components/ui/input";
import {Label as ShadcnLabel} from "@/components/ui/label";
import {AlertTriangle, CheckCircle2, Loader2} from "lucide-react";
// Optional: for toasts
// import { toast } from "sonner";

export interface ModalOnAction {
    onClose?: () => void;
    isOpen?: boolean;
}

interface NewProductionState {
    name: string;
    startDate: string;
    endDate: string;
}

const initialProductionState: NewProductionState = {
    name: "",
    startDate: "",
    endDate: "",
};

export const CreateProduction = ({onClose, isOpen}: ModalOnAction) => {
    const [newProduction, setNewProduction] = useState<NewProductionState>(initialProductionState);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);
    const router = useRouter();

    // Reset form when modal opens/closes or isOpen state changes
    useEffect(() => {
        if (isOpen) {
            setNewProduction(initialProductionState);
            setApiError(null);
            setSuccessMessage(null);
            setDateError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleInputChange = (field: keyof NewProductionState, value: string) => {
        const currentProduction = {...newProduction, [field]: value};

        setNewProduction(currentProduction); // Update state immediately for responsiveness

        // Date validation logic
        if (field === "startDate" || field === "endDate") {
            if (currentProduction.startDate && currentProduction.endDate) {
                const start = new Date(currentProduction.startDate);
                const end = new Date(currentProduction.endDate);
                if (end < start) {
                    setDateError("End date cannot be earlier than start date.");
                } else {
                    setDateError(null);
                }
            } else {
                // Clear date error if one of the dates is missing, as validation is for both
                setDateError(null);
            }
        }
    };


    const handleAddProduction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        if (dateError) return; // Don't submit if there's a known date error

        // Basic name validation (can be enhanced with Zod later if needed)
        if (!newProduction.name.trim()) {
            setApiError("Production name is required.");
            return;
        }
        if (!newProduction.startDate) {
            setApiError("Start date is required.");
            return;
        }
        if (!newProduction.endDate) {
            setApiError("End date is required.");
            return;
        }


        setIsLoading(true);
        setSuccessMessage(null);
        setApiError(null);

        try {
            const response = await createProduction(newProduction);

            if (response.error && response.error.state) { // Check if response.error itself exists
                setApiError(response.error.message);
                // toast.error(response.error.message);
            } else if (response.data && response.data.id) { // Ensure data and id exist for success
                setSuccessMessage("Production created successfully! Redirecting...");
                // toast.success("Production created successfully! Redirecting...");
                setNewProduction(initialProductionState); // Reset form
                // Wait a bit for the user to see the success message before redirecting
                setTimeout(() => {
                    if (onClose) onClose(); // Close modal before redirect
                    if(response.data){
                        router.push(`/productions/${response.data.id}`);
                    }
                }, 1500);
            } else {
                // Handle unexpected success response structure
                setApiError("An unexpected response was received from the server.");
                // toast.error("An unexpected response was received from the server.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setApiError("An unexpected error occurred. Please try again.");
            // toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalOpenChange = (open: boolean) => {
        if (!isLoading) { // Prevent closing if loading
            if (!open && onClose) {
                onClose();
            }
            // If you need to manage isOpen state from here, you'd typically lift it
            // But for now, we just call onClose
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
            <DialogContent className="sm:max-w-[450px]"> {/* Adjust width */}
                <DialogHeader>
                    <DialogTitle className="text-xl">Create New Production</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new production run.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddProduction} className="space-y-4 py-2">
                    {/* Production Name */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="productionName">Production Name</ShadcnLabel>
                        <ShadcnInput
                            id="productionName"
                            placeholder="e.g., Summer Batch Alpha"
                            value={newProduction.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="startDate">Start Date</ShadcnLabel>
                        <ShadcnInput
                            id="startDate"
                            type="date"
                            value={newProduction.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="endDate">End Date</ShadcnLabel>
                        <ShadcnInput
                            id="endDate"
                            type="date"
                            value={newProduction.endDate}
                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {dateError && (
                        <p className="text-sm font-medium text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4"/> {dateError}
                        </p>
                    )}
                    {apiError && (
                        <p className="text-sm font-medium text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4"/> {apiError}
                        </p>
                    )}
                    {successMessage && !apiError && ( // Only show success if no API error
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4"/> {successMessage}
                        </p>
                    )}


                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <ShadcnButton type="button" variant="outline" disabled={isLoading}>
                                Cancel
                            </ShadcnButton>
                        </DialogClose>
                        <ShadcnButton type="submit"
                                      disabled={isLoading || !!dateError || !newProduction.name || !newProduction.startDate || !newProduction.endDate}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isLoading ? "Creating..." : "Create Production"}
                        </ShadcnButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};