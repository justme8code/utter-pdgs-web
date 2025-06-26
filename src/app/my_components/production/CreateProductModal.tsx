// app/your-path/CreateProductModal.tsx (or CreateProductModal.tsx)
'use client';

import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {Ingredient} from "@/app/types"; // Assuming Uom type might also be in types
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// Shadcn UI Imports
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
import {Textarea as ShadcnTextarea} from "@/components/ui/textarea";
import {Label as ShadcnLabel} from "@/components/ui/label";
import {Checkbox as ShadcnCheckbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, AlertTriangle, CheckCircle2, ListChecks, Loader2, PackagePlus, Scale} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useUomStore} from "@/app/store/uomStore";

const productSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters").nonempty("Product name is required"),
    description: z.string().max(100, "Description must be at most 100 characters").nonempty("Description is required"),
    unitOfMeasure: z.string().nonempty("Unit of measure is required"), // This will be the value from Select
});
type ProductFormValues = z.infer<typeof productSchema>;

export interface ModalOnAction {
    onClose?: () => void;
    isOpen?: boolean;
}

export const CreateProductModal: React.FC<ModalOnAction> = ({onClose, isOpen}) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {addProduct, error: productStoreError, isLoading: productStoreIsLoading} = useProductStore();
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const {ingredients, fetchIngredients, isLoading: ingredientsLoading} = useIngredientStore();
    const {uoms, fetchUoms} = useUomStore(); // Assuming uoms is an array like [{id: string, name: string, abbrev: string}, ...]

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting: formIsSubmitting}
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {name: "", description: "", unitOfMeasure: ""},
    });

    useEffect(() => {
        if (isOpen) {
            fetchIngredients();
            fetchUoms(); // Fetch UOMs when the modal opens
            reset({name: "", description: "", unitOfMeasure: ""});
            setSelectedIngredients([]);
            setSuccessMessage(null);
            // Consider clearing productStoreError if your store has such a method
            // const { clearError } = useProductStore.getState(); clearError?.();
        }
    }, [isOpen, fetchIngredients, fetchUoms, reset]); // Updated dependencies

    const handleCreateNewProduct = async (data: ProductFormValues) => {
        setSuccessMessage(null); // Clear previous success message
        // If you have a method to clear errors in productStore, call it here:
        // const { clearError } = useProductStore.getState(); clearError?.();

        await addProduct({
            name: data.name,
            description: data.description,
            unitOfMeasure: data.unitOfMeasure,
            ingredients: selectedIngredients,
        });

        const currentStoreError = useProductStore.getState().error;
        if (!currentStoreError) {
            setSuccessMessage("Product created successfully!");
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        }
    };

    const toggleIngredientSelection = (ingredient: Ingredient) => {
        setSelectedIngredients((prev) =>
            prev.some((i) => i.id === ingredient.id)
                ? prev.filter((i) => i.id !== ingredient.id)
                : [...prev, ingredient]
        );
    };

    const uiIsLoading = formIsSubmitting || productStoreIsLoading || ingredientsLoading; // Add uomIsLoading if your uomStore provides it

    const FieldErrorMessage = ({message}: { message: string | undefined }) => (
        message ? <p className="text-xs font-medium text-destructive pt-1 flex items-center gap-1"><AlertCircle
            className="h-3 w-3"/>{message}</p> : null
    );

    return (
        <Dialog open={isOpen ?? false} onOpenChange={(open) => {
            if (!open && !uiIsLoading && onClose) onClose();
        }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <PackagePlus className="h-5 w-5"/> Create New Product Template
                    </DialogTitle>
                    <DialogDescription>
                        Define a new product by providing its details and standard ingredients.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleCreateNewProduct)} className="space-y-4 py-2">
                    {productStoreError && !successMessage && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>Error Creating Product</AlertTitle>
                            <AlertDescription>{productStoreError}</AlertDescription>
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert variant="default"
                               className="mt-2 bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4"/>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="productName-create-modal">Product Name</ShadcnLabel>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => (
                                <ShadcnInput id="productName-create-modal"
                                             placeholder="e.g., Premium Orange Juice" {...field}
                                             disabled={uiIsLoading}/>
                            )}
                        />
                        <FieldErrorMessage message={errors.name?.message}/>
                    </div>

                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="productDescription-create-modal">Product Description</ShadcnLabel>
                        <Controller
                            name="description"
                            control={control}
                            render={({field}) => (
                                <ShadcnTextarea id="productDescription-create-modal"
                                                placeholder="Describe the product..." {...field} disabled={uiIsLoading}
                                                rows={3}/>
                            )}
                        />
                        <FieldErrorMessage message={errors.description?.message}/>
                    </div>

                    {/* Unit of Measure - Implemented with Shadcn Select */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="unitOfMeasure-select-trigger">Unit of Measure</ShadcnLabel>
                        <Controller
                            name="unitOfMeasure"
                            control={control}
                            render={({field}) => (
                                <Select
                                    onValueChange={field.onChange} // RHF's onChange updates form state
                                    value={field.value} // RHF's value sets the current selection
                                    name={field.name} // Field name
                                    disabled={uiIsLoading || !uoms || uoms.length === 0} // Disable if loading or no UOMs
                                >
                                    <SelectTrigger
                                        id="unitOfMeasure-select-trigger" // For label association
                                        ref={field.ref} // Pass ref for RHF focus management
                                        className="h-8 w-[140px] px-2 py-1 text-xs font-medium text-black tracking-tight" // Your specified styling
                                        onBlur={field.onBlur} // RHF validation trigger
                                    >
                                        <Scale className="h-5 w-5 mr-1 text-black"/> {/* Your icon styling */}
                                        <SelectValue placeholder="UOM"/> {/* Your placeholder */}
                                    </SelectTrigger>
                                    <SelectContent className="text-sm"> {/* Your specified styling */}
                                        {/* Map over uoms if available, otherwise content will be empty (trigger disabled) */}
                                        {uoms?.map((uom) => (
                                            <SelectItem
                                                value={uom.abbrev} // The value to be submitted
                                                key={uom.id}
                                                className="text-center text-sm text-muted-foreground py-1" // Your specified item styling
                                            >
                                                {uom.abbrev} {/* The text displayed for the option */}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldErrorMessage message={errors.unitOfMeasure?.message}/>
                    </div>

                    {/* Ingredient Selection */}
                    {ingredientsLoading ? (
                        <div className="flex items-center justify-center h-24 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin mr-2"/> Loading ingredients...
                        </div>
                    ) : ingredients.length > 0 ? (
                        <div className="space-y-2 pt-2">
                            <ShadcnLabel className="flex items-center gap-1.5 font-semibold">
                                <ListChecks className="h-4 w-4 text-muted-foreground"/> Select Standard Ingredients:
                                {selectedIngredients.length === 0 &&
                                    <span className="text-xs text-destructive ml-1">(Required)</span>}
                            </ShadcnLabel>
                            <ScrollArea className="h-32 rounded-md border p-3">
                                <div className="space-y-2">
                                    {ingredients.map((ingredient) => (
                                        <div key={ingredient.id} className="flex items-center space-x-2">
                                            <ShadcnCheckbox
                                                id={`ingredient-${ingredient.id}-create-modal`}
                                                checked={selectedIngredients.some((i) => i.id === ingredient.id)}
                                                onCheckedChange={() => toggleIngredientSelection(ingredient)}
                                                disabled={uiIsLoading}
                                            />
                                            <label
                                                htmlFor={`ingredient-${ingredient.id}-create-modal`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                            >
                                                {ingredient.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic py-2">No ingredients available to select.
                            Please add ingredients first.</p>
                    )}

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <ShadcnButton type="button" variant="outline" disabled={uiIsLoading}>
                                Cancel
                            </ShadcnButton>
                        </DialogClose>
                        <ShadcnButton type="submit" disabled={uiIsLoading}>
                            {(formIsSubmitting || productStoreIsLoading) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {(formIsSubmitting || productStoreIsLoading) ? "Creating..." : "Create Product"}
                        </ShadcnButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};