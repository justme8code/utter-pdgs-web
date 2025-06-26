// app/your-path/FormPurchase.tsx
'use client';

// Original Zod Schema and Type
import {z} from 'zod';
// React and other imports
import {zodResolver} from '@hookform/resolvers/zod';
import {Control, Controller, FieldError, FieldValues, Path, useForm, UseFormRegister} from 'react-hook-form';
import React, {useCallback, useEffect, useState} from "react";
import {createPurchase as createPurchaseAction} from "@/api/purchase";

// Shadcn UI Imports
import {Button as ShadcnButton} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input as ShadcnInput} from "@/components/ui/input";
import {Label as ShadcnLabel} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {AlertCircle, Loader2, PlusCircle} from "lucide-react";
import {cn} from '@/lib/utils';
import {toast} from "sonner"; // <--- IMPORT TOAST FROM SONNER
// Your Store Imports
import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
// We might not need useLoadingUI for toast messages here, but keep for globalLoading
import {useLoadingUI} from "@/app/store/useLoadingUI";

// Your Utility/Type Imports
import {convertToPurchaseEntity} from "@/app/ui/form/purchaseForm/actions";
import {
    calAverageCostPerKgBasedOnTotalWeight,
    calAverageWeightPerUOMBasedOnTotalWeight
} from "@/app/utils/production-computing-formulas";

const invalid_type_error = {invalid_type_error: "Can't be empty"}
const purchaseFormSchema = z.object({
    uom: z.string(),
    uomQty: z.coerce.number(invalid_type_error).min(0, "Average cost must be positive"),
    weight: z.coerce.number(invalid_type_error).min(0, "Weight must be positive"),
    productionLostWeight: z.coerce.number(invalid_type_error).min(0, "Lost weight must be positive"),
    usableWeight: z.coerce.number(invalid_type_error).min(0, "Usable weight must be positive"),
    cost: z.coerce.number({invalid_type_error: "Cost needed"}).min(0, "Cost must be positive"),
    avgCost: z.coerce.number({invalid_type_error: "Average cost needed"}).min(0, "Average cost must be positive"),
    avgWeightPerUOM: z.coerce.number({invalid_type_error: "Average weight per uom needed"}).min(0, "Average cost must be positive"),
    rawMaterialId: z.coerce.number({invalid_type_error: "Raw Material must be selected"}).min(1, "Please select a raw material"),
    supplierId: z.coerce.number({invalid_type_error: "Supplier must be selected"}).min(1, "Please select a supplier"),
});
export type PurchaseForm = z.infer<typeof purchaseFormSchema>;


interface ShadcnFormFieldProps<TFieldValues extends FieldValues = PurchaseForm> {
    label: string;
    name: Path<TFieldValues>;
    type?: React.HTMLInputTypeAttribute;
    control?: Control<TFieldValues>;
    register?: UseFormRegister<TFieldValues>;
    error?: FieldError | string;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    options?: { value: string | number; label: string }[];
    as?: 'input' | 'select';
}

const ShadcnFormInput: React.FC<
    Omit<ShadcnFormFieldProps<PurchaseForm>, 'options' | 'as' | 'control'>
> = ({
         label, name, type = "text", register, error, readOnly = false, placeholder, className, inputClassName
     }) => {
    if (!register) {
        console.error(`ShadcnFormInput: 'register' prop is required for field "${name}".`);
        return null;
    }
    const errorMessage = typeof error === 'string' ? error : error?.message;
    return (
        <div className={cn("space-y-1", className)}>
            <ShadcnLabel htmlFor={name} className="text-xs font-medium text-muted-foreground">{label}</ShadcnLabel>
            <ShadcnInput
                id={name} type={type} step={type === "number" ? "any" : undefined}
                {...register(name, {valueAsNumber: type === "number"})}
                readOnly={readOnly} placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className={cn("w-full h-9 text-sm", readOnly && "bg-muted/70 cursor-not-allowed", inputClassName)}
                aria-invalid={!!errorMessage}
            />
            {errorMessage &&
                <p className="text-xs font-medium text-destructive pt-1 flex items-center gap-1"><AlertCircle
                    className="h-3 w-3"/>{errorMessage}</p>}
        </div>
    );
};


export const FormPurchase = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {rawMaterials, fetchRawMaterials} = useRawMaterialStore();
    const {suppliers, fetchSuppliers} = useSupplierStore();
    const {selectedProduction, setSelectedProduction} = useProductionStore();
    const {purchases, setPurchases} = usePurchaseStore();
    // Keep globalLoading for button state, but success/error messages will be handled by toast
    const {
        setLoading: setGlobalLoading,
        loading: globalLoading,
        setErrorMessage: setGlobalError,
        setSuccessMessage
    } = useLoadingUI();


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: {errors, isSubmitting}
    } = useForm<PurchaseForm>({
        resolver: zodResolver(purchaseFormSchema),
        defaultValues: {
            avgCost: 0, usableWeight: 0, avgWeightPerUOM: 0, uom: "",
            uomQty: undefined, weight: undefined, productionLostWeight: 0,
            cost: undefined, rawMaterialId: undefined, supplierId: undefined,
        }
    });

    const weight = watch('weight');
    const rawMaterialId = watch('rawMaterialId');
    const productionLostWeight = watch('productionLostWeight');
    const uomQty = watch('uomQty');
    const cost = watch('cost');

    const findRawMaterial = rawMaterials.find((rawMaterial) => rawMaterial.id === rawMaterialId);


    useEffect(() => {
        if (isDialogOpen) {
            fetchRawMaterials();
            fetchSuppliers();
            // Clear any global messages when dialog opens if they are from useLoadingUI
            setGlobalError(null);
            setSuccessMessage(null, false); // Or however you clear it in useLoadingUI
        }
    }, [isDialogOpen, fetchRawMaterials, fetchSuppliers, setGlobalError, setSuccessMessage]);

    const handleAutoCalculations = useCallback(() => {
        const currentWeight = typeof weight === 'number' ? weight : 0;
        const currentProdLostWeight = typeof productionLostWeight === 'number' ? productionLostWeight : 0;
        const currentUomQty = typeof uomQty === 'number' ? uomQty : 0;
        const currentCost = typeof cost === 'number' ? cost : 0;

        const usableWeightCalc = Math.max(0, currentWeight - currentProdLostWeight);
        const avgWeightPerUOMCalc = calAverageWeightPerUOMBasedOnTotalWeight({
            weight: currentWeight,
            qty: currentUomQty
        });
        const avgCostCalc = calAverageCostPerKgBasedOnTotalWeight({weight: currentWeight, cost: currentCost});

        setValue('usableWeight', parseFloat(usableWeightCalc.toFixed(2)), {shouldValidate: true, shouldDirty: true});
        setValue('avgWeightPerUOM', parseFloat(avgWeightPerUOMCalc.toFixed(2) || "0"), {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('avgCost', parseFloat(avgCostCalc.toFixed(2) || "0"), {shouldValidate: true, shouldDirty: true});
    }, [weight, productionLostWeight, uomQty, cost, setValue]);

    useEffect(() => {
        handleAutoCalculations();
    }, [handleAutoCalculations]);
    useEffect(() => {
        const selectedRawMaterial = rawMaterials.find(rm => rm.id === Number(rawMaterialId));
        setValue('uom', selectedRawMaterial?.uom || '', {shouldValidate: true});
    }, [rawMaterialId, rawMaterials, setValue]);

    const handleOpenDialog = () => {
        reset();
        setIsDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const onSubmitPurchase = async (data: PurchaseForm) => {
        setGlobalLoading(true); // For button state, page overlay if LoadingWrapper is used

        const purchaseEntity = convertToPurchaseEntity(data, rawMaterials, suppliers);

        if (selectedProduction && selectedProduction.id) {
            try {
                const response = await createPurchaseAction(selectedProduction.id, purchaseEntity);
                if (response.status && response.data) {
                    setPurchases([response.data.purchase, ...purchases]);
                    if (response.data.productionStore && selectedProduction) {
                        setSelectedProduction({...selectedProduction, productionStore: response.data.productionStore});
                    }
                    toast.success(response.error.message || "Purchase created successfully!"); // <--- SONNER SUCCESS TOAST
                    handleCloseDialog();
                } else {
                    const errorMessage = response.error.message || response.error?.message || "Failed to create purchase.";
                    toast.error(errorMessage); // <--- SONNER ERROR TOAST
                    // Optionally, if you still want to set a global error for other UI elements:
                    // setGlobalError(errorMessage);
                }
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
                toast.error(errorMessage); // <--- SONNER ERROR TOAST
                // setGlobalError(errorMessage);
            }
        } else {
            const noProductionError = "No production selected to create the purchase for.";
            toast.error(noProductionError); // <--- SONNER ERROR TOAST
            // setGlobalError(noProductionError);
        }
        setGlobalLoading(false);
    };

    return (
        <>
            <ShadcnButton onClick={handleOpenDialog} size="sm">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Create Purchase
            </ShadcnButton>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open && !isSubmitting && !globalLoading) handleCloseDialog();
            }}> {/* Prevent close if global loading */}
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-semibold">Create New Purchase</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new raw material purchase. All weights are in (kg).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmitPurchase)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                            {/* Raw Material Select */}
                            <div className="space-y-1">
                                <ShadcnLabel htmlFor="rawMaterialId"
                                             className="text-xs font-medium text-muted-foreground">Raw
                                    Material</ShadcnLabel>
                                <Controller
                                    name="rawMaterialId" control={control} defaultValue={undefined}
                                    render={({field}) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                            value={field.value ? String(field.value) : ""}
                                            disabled={isSubmitting || globalLoading} // Disable select during submission
                                        >
                                            <SelectTrigger id="rawMaterialId" className="w-full h-9 text-sm"
                                                           aria-invalid={errors.rawMaterialId ? "true" : "false"}>
                                                <SelectValue placeholder="Select Raw Material"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rawMaterials.map(rm => (
                                                    <SelectItem key={rm.id} value={String(rm.id ?? "")}>
                                                        {rm.name} ({rm.uom})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.rawMaterialId &&
                                    <p className="text-xs font-medium text-destructive pt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>{errors.rawMaterialId.message}</p>}
                            </div>

                            <ShadcnFormInput label="UoM (Auto)" name="uom" type="text" readOnly register={register}
                                             error={errors.uom?.message}/>
                            <ShadcnFormInput label="Quantity (by UoM)" name="uomQty" type="number" register={register}
                                             error={errors.uomQty?.message}/>

                            {/* Supplier Select */}
                            <div className="space-y-1">
                                <ShadcnLabel htmlFor="supplierId"
                                             className="text-xs font-medium text-muted-foreground">Supplier</ShadcnLabel>
                                <Controller
                                    name="supplierId" control={control} defaultValue={undefined}
                                    render={({field}) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                            value={field.value ? String(field.value) : ""}
                                            disabled={isSubmitting || globalLoading}
                                        >
                                            <SelectTrigger id="supplierId" className="w-full h-9 text-sm"
                                                           aria-invalid={errors.supplierId ? "true" : "false"}>
                                                <SelectValue placeholder="Select Supplier"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers.map(s => (
                                                    <SelectItem key={s.id} value={String(s.id ?? "")}>
                                                        {s.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.supplierId &&
                                    <p className="text-xs font-medium text-destructive pt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>{errors.supplierId.message}</p>}
                            </div>

                            {/* Other ShadcnFormInput fields remain the same */}
                            <ShadcnFormInput label={`Total Weight ${findRawMaterial?.uom ?? ""}`} name="weight"
                                             type="number" register={register} error={errors.weight?.message}/>
                            <ShadcnFormInput label="Lost in Production (kg)" name="productionLostWeight" type="number"
                                             register={register} error={errors.productionLostWeight?.message}/>
                            <ShadcnFormInput label="Usable Weight (kg) (Auto)" name="usableWeight" type="number"
                                             readOnly register={register} error={errors.usableWeight?.message}/>
                            <ShadcnFormInput label="Total Cost (₦)" name="cost" type="number" register={register}
                                             error={errors.cost?.message}/>
                            <ShadcnFormInput label="Avg. Cost/kg (Auto)" name="avgCost" type="number" readOnly
                                             register={register} error={errors.avgCost?.message}/>
                            <ShadcnFormInput label="Avg. Weight/UoM (Auto)" name="avgWeightPerUOM" type="number"
                                             readOnly register={register} error={errors.avgWeightPerUOM?.message}/>
                        </div>

                        <DialogFooter className="pt-6">
                            <ShadcnButton type="button" variant="outline" onClick={handleCloseDialog}
                                          disabled={isSubmitting || globalLoading}>
                                Cancel
                            </ShadcnButton>
                            <ShadcnButton type="submit" disabled={isSubmitting || globalLoading}>
                                {(isSubmitting || globalLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Create Purchase
                            </ShadcnButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};