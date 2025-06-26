// app/your-path/UomModal.tsx
'use client';

import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {Unitofmeasurement} from '@/app/types'; // Your existing type
import {useUomStore} from '@/app/store/uomStore'; // Adjust path
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {AlertTriangle, Loader2} from 'lucide-react';
import {toast} from 'sonner'; // Using sonner for notifications
import {UomFormData, uomFormSchema} from '@/lib/schema';

interface UomModalProps {
    uom?: Unitofmeasurement; // For editing
    isOpen: boolean;
    onClose: () => void;
}

export const UomModal: React.FC<UomModalProps> = ({uom, isOpen, onClose}) => {
    const {createUom, updateUom, fetchUoms} = useUomStore(); // Assuming these actions exist
    const isEditMode = !!uom && !!uom.id;

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<UomFormData>({
        resolver: zodResolver(uomFormSchema),
        defaultValues: {
            name: '',
            abbrev: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && uom) {
                reset({name: uom.name, abbrev: uom.abbrev});
            } else {
                reset({name: '', abbrev: ''});
            }
        }
    }, [isOpen, isEditMode, uom, reset]);

    const onSubmit = async (data: UomFormData) => {
        let success = false;
        let message = '';

        if (isEditMode && uom?.id) {
            console.log(data);
            const result = await updateUom(uom.id, data); // Assume updateUom returns { success: boolean, message?: string }
            if (result.status) {
                message = "UoM updated successfully!"
                success = true;
            }
        } else {
            const result = await createUom(data); // Assume createUom returns { success: boolean, message?: string, data?: Unitofmeasurement }
            if (result.status) {
                message = "UOM created successfully!";
                success = true;
            } else {
                message = result.error || "Failed to create UOM!";
            }
        }

        if (success) {
            toast.success(message);
            fetchUoms(); // Refresh the list
            onClose();
        } else {
            toast.error(message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open && !isSubmitting) onClose();
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Unit of Measurement' : 'Add New Unit of Measurement'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the details of this UoM.' : 'Enter the name and abbreviation for the new UoM.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* UoM Name */}
                    <div className="space-y-1">
                        <Label htmlFor="uom-name">Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => (
                                <Input id="uom-name" placeholder="e.g., Kilogram, Litre" {...field}
                                       disabled={isSubmitting}/>
                            )}
                        />
                        {errors.name &&
                            <p className="text-sm font-medium text-destructive flex items-center gap-1"><AlertTriangle
                                className="h-3.5 w-3.5"/>{errors.name.message}</p>}
                    </div>

                    {/* UoM Abbreviation */}
                    <div className="space-y-1">
                        <Label htmlFor="uom-abbrev">Abbreviation</Label>
                        <Controller
                            name="abbrev"
                            control={control}
                            render={({field}) => (
                                <Input id="uom-abbrev" placeholder="e.g., kg, L, pcs" {...field}
                                       disabled={isSubmitting}/>
                            )}
                        />
                        {errors.abbrev &&
                            <p className="text-sm font-medium text-destructive flex items-center gap-1"><AlertTriangle
                                className="h-3.5 w-3.5"/>{errors.abbrev.message}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isEditMode ? 'Save Changes' : 'Create UoM'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};