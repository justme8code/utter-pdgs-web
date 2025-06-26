// app/your-path/CreateSupplierModal.tsx
'use client';

import React, {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateSupplier} from "@/api/inventory"; // Assuming correct path
import {SupplierFormData, supplierSchema} from "@/app/(main)/suppliers/supplierform"; // Assuming correct path
import {Supplier} from "@/app/types";

import {Button as ShadcnButton} from "@/components/ui/button"; // Shadcn Button
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input as ShadcnInput} from "@/components/ui/input"; // Shadcn Input
import {Label as ShadcnLabel} from "@/components/ui/label"; // Shadcn Label
import {Loader2} from "lucide-react";
// Optional: for toasts
// import { toast } from "sonner";
import useSupplierStore from "@/app/store/SupplierStore"; // Import store to call fetchSuppliers

interface CreateSupplierModalProps {
    supplier?: Supplier;
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
}

export const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({
                                                                            isEdit,
                                                                            supplier,
                                                                            isOpen,
                                                                            onClose,
                                                                        }) => {
    const {
        fetchSuppliers,
        createSupplier: createSupplierAction, /* updateSupplier: updateSupplierAction - if you add it to store */
    } = useSupplierStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            fullName: "",
            address: "",
            phoneNumber: "",
            emailAddress: "",
        },
    });

    useEffect(() => {
        if (isOpen) { // Reset form when modal opens
            if (isEdit && supplier) {
                reset({
                    fullName: supplier.fullName ?? "",
                    address: supplier.address ?? "",
                    phoneNumber: supplier.phoneNumber ?? "",
                    emailAddress: supplier.emailAddress ?? "",
                });
            } else {
                reset({ // Reset to default for new supplier
                    fullName: "",
                    address: "",
                    phoneNumber: "",
                    emailAddress: "",
                });
            }
        }
    }, [supplier, isEdit, isOpen, reset]);


    const onSubmit = async (data: SupplierFormData) => {
        let result;
        if (!isEdit) {
            // Use the store's createSupplier action
            result = await createSupplierAction(data); // createSupplierAction expects Omit<Supplier, 'id'>
            // Ensure data matches this or adjust data sent
        } else {
            if (supplier && supplier.id) {
                // You'll need an updateSupplier action in your store for consistency
                // For now, directly calling the server action
                const {status, data: updatedData, error: apiError} = await updateSupplier(supplier.id, {
                    id: supplier.id, // server action might need id in payload
                    ...data,
                });
                result = {success: status, data: updatedData, error: apiError?.message};
            } else {
                // Handle case where supplier or supplier.id is missing in edit mode
                console.error("Supplier ID is missing in edit mode.");
                // toast.error("Cannot update supplier: ID is missing.");
                alert("Cannot update supplier: ID is missing."); // Simple alert
                return;
            }
        }

        if (result?.success) {
            // toast.success(`Supplier ${isEdit ? "updated" : "created"} successfully!`);
            alert(`Supplier ${isEdit ? "updated" : "created"} successfully!`); // Simple alert
            fetchSuppliers(); // Re-fetch suppliers to update the list
            onClose();
        } else {
            // toast.error(result?.error || `Failed to ${isEdit ? "update" : "create"} supplier.`);
            alert(result?.error || `Failed to ${isEdit ? "update" : "create"} supplier.`); // Simple alert
        }
    };

    // Prevent closing modal on overlay click if submitting
    const handleOpenChange = () => {
        if (!isSubmitting) {
            onClose(); // Call original onClose
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[480px]"> {/* Adjust width as needed */}
                <DialogHeader>
                    <DialogTitle className="text-xl">{isEdit ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the details for this supplier." : "Enter the details for the new supplier."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="fullName">Full Name</ShadcnLabel>
                        <Controller
                            name="fullName"
                            control={control}
                            render={({field}) => (
                                <ShadcnInput
                                    id="fullName"
                                    placeholder="e.g., John Doe Supplies"
                                    {...field}
                                    aria-invalid={errors.fullName ? "true" : "false"}
                                />
                            )}
                        />
                        {errors.fullName &&
                            <p className="text-sm font-medium text-destructive">{errors.fullName.message}</p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="address">Address</ShadcnLabel>
                        <Controller
                            name="address"
                            control={control}
                            render={({field}) => (
                                <ShadcnInput
                                    id="address"
                                    placeholder="e.g., 123 Main St, Anytown"
                                    {...field}
                                    aria-invalid={errors.address ? "true" : "false"}
                                />
                            )}
                        />
                        {errors.address &&
                            <p className="text-sm font-medium text-destructive">{errors.address.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="phoneNumber">Phone Number</ShadcnLabel>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({field}) => (
                                <ShadcnInput
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="e.g., +1-555-123-4567"
                                    {...field}
                                    aria-invalid={errors.phoneNumber ? "true" : "false"}
                                />
                            )}
                        />
                        {errors.phoneNumber &&
                            <p className="text-sm font-medium text-destructive">{errors.phoneNumber.message}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="emailAddress">Email Address</ShadcnLabel>
                        <Controller
                            name="emailAddress"
                            control={control}
                            render={({field}) => (
                                <ShadcnInput
                                    id="emailAddress"
                                    type="email"
                                    placeholder="e.g., contact@johndoesupplies.com"
                                    {...field}
                                    aria-invalid={errors.emailAddress ? "true" : "false"}
                                />
                            )}
                        />
                        {errors.emailAddress &&
                            <p className="text-sm font-medium text-destructive">{errors.emailAddress.message}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <ShadcnButton type="button" variant="outline" disabled={isSubmitting}>
                                Cancel
                            </ShadcnButton>
                        </DialogClose>
                        <ShadcnButton type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isSubmitting ? "Processing..." : isEdit ? "Update Supplier" : "Add Supplier"}
                        </ShadcnButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};