'use client';
import { z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {Button} from "@headlessui/react";
import React, {useCallback, useState} from "react";
import {AppDialog} from "@/app/ui/dailog/AppDialog";
import {FormInput} from "@/app/ui/form/FormInput";
import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";
import {convertToPurchaseEntity} from "@/app/ui/form/purchaseForm/actions";
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import LoadingWrapper from "@/app/components/LoadingWrapper";
import {useLoadingUI} from "@/app/store/useLoadingUI";
import {
    calAverageCostPerKgBasedOnTotalWeight,
    calAverageWeightPerUOMBasedOnTotalWeight
} from "@/app/utils/production-computing-formulas";
import {createPurchase} from "@/app/actions/purchase";

const invalid_type_error = {invalid_type_error:"Can't be empty"}
const purchaseFormSchema = z.object({
    uom: z.string(),
    uomQty: z.coerce.number(invalid_type_error).min(0, "Average cost must be positive"),
    weight: z.coerce.number(invalid_type_error).min(0, "Weight must be positive"),
    productionLostWeight: z.coerce.number(invalid_type_error).min(0, "Lost weight must be positive"),
    usableWeight: z.coerce.number(invalid_type_error).min(0, "Usable weight must be positive"),
    cost: z.coerce.number(invalid_type_error).min(1, "Cost must be positive"),
    avgCost: z.coerce.number(invalid_type_error).min(0, "Average cost must be positive"),
    avgWeightPerUOM: z.coerce.number(invalid_type_error).min(0, "Average cost must be positive"),

    rawMaterialId: z.coerce.number().min(1, "Please select a raw material"),
    supplierId: z.coerce.number().min(1, "Please select a supplier"),
});

export type PurchaseForm =  z.infer<typeof purchaseFormSchema>;


export const FormPurchase = () => {
    const [open, setOpen] = useState(false);
    const {rawMaterials} = useRawMaterialStore();
    const {suppliers} = useSupplierStore();
    const {setSelectedProduction,selectedProduction} = useProductionStore();
    const {setPurchases,purchases} = usePurchaseStore();
    const {setLoading,setSuccessMessage,loading} = useLoadingUI();



    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<PurchaseForm>({
        resolver: zodResolver(purchaseFormSchema),
        defaultValues: {
            avgCost: 0,
            usableWeight: 0,
            avgWeightPerUOM: 0,
        }
    });

    // Watch the two inputs you care about
    const weight = watch('weight') || 0;
    const rawMaterialId = watch('rawMaterialId');
    const productionLostWeight = watch('productionLostWeight') || 0;
    const uomQty = watch('uomQty');
    const cost = watch('cost');


    // cleaner if setValue is stable
    const handleAutoCalculations = useCallback(() => {
        const usableWeight = weight - productionLostWeight;
        const avgWeightPerUOM = calAverageWeightPerUOMBasedOnTotalWeight({ weight, qty: uomQty });
        const avgCost = calAverageCostPerKgBasedOnTotalWeight({ weight, cost });

        setValue('usableWeight', parseFloat(usableWeight.toFixed(2)), { shouldValidate: true, shouldDirty: true });
        setValue('avgWeightPerUOM', parseFloat(avgWeightPerUOM.toFixed(2)), { shouldValidate: true, shouldDirty: true });
        setValue('avgCost', parseFloat(avgCost.toFixed(2)), { shouldValidate: true, shouldDirty: true });
    }, [weight, productionLostWeight, uomQty, cost, setValue]);


    React.useEffect(() => {
        handleAutoCalculations();
    }, [handleAutoCalculations]);

    React.useEffect(() => {
        const selectedRawMaterial = rawMaterials.find(rm => rm.id === Number(rawMaterialId));
        setValue('uom', selectedRawMaterial?.uom || '', { shouldValidate: true });
    }, [rawMaterialId, rawMaterials, setValue]);


    const handleClose = () => {
        reset();
        setOpen(false);
    }

    const handleSubmitPurchase = async (data: PurchaseForm) => {
        setLoading(true);
        const purchase = convertToPurchaseEntity(data, rawMaterials, suppliers);

        if (selectedProduction && selectedProduction.id) {
            const { data, status, message } = await createPurchase(selectedProduction.id, purchase);
            setSuccessMessage(message, status);
            if(status){
                setPurchases([data.purchase, ...purchases]);
                setSelectedProduction({
                    ...selectedProduction,
                    productionStore: data.productionStore
                });
            }
        }
        setLoading(false);
        handleClose();
    };



    return (
        <>
            <Button className={"rounded px-2 py-2 data-hover:data-active:bg-sky-700 text-white bg-sky-600 w-full max-w-32 text-sm"}
                    onClick={() => setOpen(true)}
            >
                Create purchase
            </Button>

            <LoadingWrapper isLoading={loading}>
                <AppDialog isOpen={open} onClose={() => setOpen(false)}
                           title={"Purchase"}
                           description={"Create a new purchase"}
                           className={"space-y-10 p-6"}
                >
                    <form onSubmit={handleSubmit(handleSubmitPurchase)} className={"space-y-6 p-6"}>
                        <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>

                            <div>
                                <label htmlFor="rawMaterialId">Raw Material</label>
                                <select
                                    {...register("rawMaterialId")}
                                    className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                                >
                                    <option value="0">Select Raw Material</option>
                                    {rawMaterials.map(rm => (
                                        <option key={rm.id} value={rm.id??0}>
                                            {rm.name} ({rm.uom})
                                        </option>
                                    ))}
                                </select>
                                {errors.rawMaterialId && <p className="text-red-500 text-sm">{errors.rawMaterialId.message}</p>}
                            </div>


                            <FormInput
                                label="UoM"
                                name="uom"
                                type="text"
                                readOnly={true}
                                register={register}
                                error={errors.uom?.message}
                            />

                            <FormInput
                                label="uomQty"
                                name="uomQty"
                                type="number"
                                asNumber={true}
                                register={register}
                                error={errors.uomQty?.message}
                            />

                            <div>
                                <label htmlFor="supplierId">Supplier</label>
                                <select
                                    {...register("supplierId")}
                                    className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                                >
                                    <option value="0">Select Supplier</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.fullName}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId.message}</p>}
                            </div>

                            <FormInput
                                label="Weight"
                                name="weight"
                                asNumber={true}
                                type="number"
                                register={register}
                                error={errors.weight?.message}
                            />

                            <FormInput
                                label="Lost Weight"
                                asNumber={true}
                                name="productionLostWeight"
                                type="number"
                                register={register}
                                error={errors.productionLostWeight?.message}
                            />
                            <FormInput
                                label="Usable Weight"
                                asNumber={true}
                                name="usableWeight"
                                type="number"
                                register={register}
                                readOnly={true}
                                error={errors.usableWeight?.message}
                            />

                            <FormInput
                                label="₦Cost"
                                asNumber={true}
                                name="cost"
                                type="number"
                                register={register}
                                error={errors.cost?.message}
                            />


                            <FormInput
                                label="Avg Cost / (kg) (Auto)"
                                asNumber={true}
                                name="avgCost"
                                type="number"
                                register={register}
                                readOnly={true}
                                error={errors.avgCost?.message}
                            />


                            <FormInput
                                label="Avg Weight/Uom (Auto)"
                                asNumber={true}
                                name="avgWeightPerUOM"
                                type="number"
                                register={register}
                                readOnly={true}
                                error={errors.avgWeightPerUOM?.message}
                            />

                        </div>
                        <div className={"flex justify-end gap-4 text-white"}>

                            <Button className="rounded border border-sky-600 py-2 text-sm p-4 data-hover:bg-red-500 text-black data-hover:text-white data-hover:border-red-500"
                                    onClick={() => handleClose()}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" className="rounded bg-sky-600 py-2 text-sm p-4">
                                Create Purchase
                            </Button>


                        </div>
                    </form>
                </AppDialog>
            </LoadingWrapper>

        </>
    );
};


