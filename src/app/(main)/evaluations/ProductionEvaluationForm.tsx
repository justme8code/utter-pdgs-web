// /app/features/production-evaluation/ProductionEvaluationForm.tsx
'use client';

import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useMemo, useState} from 'react';
import {ReloadIcon} from '@radix-ui/react-icons';

// Local imports
import {BasicInfoSection} from './BasicInfoSection';
import {InstructionsSection} from './InstructionSection';
import {AvailableProductsList} from './AvailableProductList';
import {ProductEvaluationTable} from './ProductionEvaluationTable';
import {TasteBudFormData, tasteBudSchema} from "@/lib/schema";

// Project-wide imports & actions
import {Navbar} from '@/components/layout/Navbar';
import {Button} from '@/components/ui/button';
import {Form} from '@/components/ui/form';
import useAuthStore from '@/app/store/useAuthStore';
import {fetchProduction} from '@/api/production';
// Corrected path
import {Evaluation, Production} from '@/app/types';
import LoadingWrapper from "@/app/my_components/LoadingWrapper";
import {createEvaluation} from "@/api/evaluation";
import {useLoadingUI2} from "@/components/LoadingUI2";

export const ProductionEvaluationForm = ({productionId}: { productionId: number }) => {
    const {auth} = useAuthStore();
    const [production, setProduction] = useState<Production | null>(null);
    const {loading, setLoading, showSuccessToast, showErrorToast} = useLoadingUI2();

    // --- FORM INITIALIZATION ---
    const form = useForm<TasteBudFormData>({
        resolver: zodResolver(tasteBudSchema),
        defaultValues: {
            evaluationType: undefined,
            name: '',
            batchRange: '',
            productEvaluations: [],
        },
    });

    // --- DATA FETCHING & LOGIC ---
    useEffect(() => {
        const fetchData = async () => {
            const {data, status} = await fetchProduction(productionId);
            if (status && data) {
                setProduction(data);
            }
        };
        fetchData();
    }, [productionId]);

    const isProductionFinalized = useMemo(
        () => production?.finalized,
        [production]
    );

    useEffect(() => {
        if (isProductionFinalized) {
            form.setValue('evaluationType', 'POST_PROCESS', {shouldValidate: true});
        }
    }, [isProductionFinalized, form]);

    useEffect(() => {
        // Set the evaluator's name when auth state is available
        if (auth?.user?.fullName) {
            // This updates RHF's internal state.
            form.setValue('name', auth.user.fullName, {shouldValidate: true});
        }

        // Set the batch range when production data is available
        if (production?.lastBatch) {
            const batchRangeValue = `BATCH-1-BATCH ${production.lastBatch}`;
            // This updates RHF's internal state.
            form.setValue('batchRange', batchRangeValue, {shouldValidate: true});
        }

        // Handle auto-selection of evaluation type
        const isFinalized = production?.finalized;
        if (isFinalized) {
            form.setValue('evaluationType', 'POST_PROCESS', {shouldValidate: true});
        }

    }, [auth, production, form]); // Dependencies array is key


    // --- FIELD ARRAY & HANDLERS ---
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'productEvaluations',
    });

    const existingProductIds = useMemo(() => fields.map(f => f.productMixId), [fields]);

    const handleAddProduct = (product: { id: number; title: string }) => {
        append({
            productMixId: product.id,
            title: product.title,
            comments: '',
            release: '',
        });
    };

    // --- THE CORE LOGIC: ONSUBMIT HANDLER ---
    const onSubmit = async (data: TasteBudFormData) => {
        setLoading(true);


        try {
            // 1. Transform form data to match the API's 'Evaluation' interface

            const evaluationPayload: Evaluation = {
                manufacturedDate: data.manufacturingDate.toISOString(),
                expirationDate: data.expiryDate.toISOString(),
                evaluationType: data.evaluationType,
                batchRange: data.batchRange,
                productionEvaluations: data.productEvaluations.map(p => ({
                    productMixId: p.productMixId,
                    // The types now match thanks to the schema update.
                    // The `?? null` is a safe way to convert `undefined` (if the field was never touched) to `null` for the API.
                    taste: p.taste ?? null,
                    afterTaste: p.afterTaste ?? null,
                    viscosity: p.viscosity ?? null,
                    comment: p.comments || '',
                    release: p.release === 'Yes',
                }))
            };

            console.log(evaluationPayload);


            // 2. Call the server action
            const {status, error} = await createEvaluation(productionId, evaluationPayload);

            // 3. Handle the response
            if (status) {
                // Call the store's helper function to show the toast
                showSuccessToast('Evaluation submitted successfully!');
                form.reset({
                    // Keep these values from the current form state
                    name: form.getValues('name'),
                    batchRange: form.getValues('batchRange'),

                    // Reset these fields to their initial/empty state
                    evaluationType: undefined,
                    manufacturingDate: undefined,
                    expiryDate: undefined,
                    productEvaluations: [],
                });

             } else {
                showErrorToast(error.message || 'An unknown error occurred.');
            }

        } catch (error) {
            console.error("Submission failed:", error);
            showErrorToast('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingWrapper isLoading={loading}>
            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">


                <Navbar title={"Production Evaluation"}/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* BasicInfoSection now needs isProductionFinalized prop */}
                        <BasicInfoSection
                            control={form.control}
                            production={production}
                        />

                        <InstructionsSection/>

                        <AvailableProductsList
                            productionId={productionId}
                            onAddProduct={handleAddProduct}
                            existingProductIds={existingProductIds}
                        />

                        <ProductEvaluationTable
                            control={form.control}
                            fields={fields}
                            onRemoveProduct={remove}
                        />

                        <div className="flex justify-end">
                            {/* FIX: Added disabled state and loading UI */}
                            <Button type="submit" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Evaluation'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </LoadingWrapper>

    );
};