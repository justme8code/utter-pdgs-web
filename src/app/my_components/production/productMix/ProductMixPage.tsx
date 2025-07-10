// app/your-path/ProductMixPage.tsx (or wherever this component is located)
'use client';

import React, {useEffect, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {ProductionStore, ProductMix} from "@/app/types"; // Assuming correct types
import {ExistingProductMixes} from "@/app/my_components/production/productMix/ExistingProductMixes"; // Assuming correct path
import {CreateNewProductMix} from "@/app/my_components/production/productMix/CreateNewProductMix"; // Assuming correct path
// Shadcn UI Imports
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Blend, ListOrdered, PlusCircle} from "lucide-react"; // Icons
import {ScrollArea} from "@/components/ui/scroll-area";
import {useConversionBatchStore} from "@/app/store/conversionBatchStore"; // Optional for visual separation

// This 'disabled' object is not used in the provided ProductMixPage,
// but I'll keep it here in case it was intended for CreateNewProductMix or ExistingProductMixes.
// If not, it can be removed.
export const disabled = {disabled: true};

// This interface seems to be for props passed TO CreateNewProductMix or ExistingProductMixes,
// not directly used by ProductMixPage itself for its own props.
export interface ProductMixComponentProps {
    mix?: ProductMix;
    onSaveProductMix?: (mix: ProductMix, productionStore: ProductionStore) => void;
}

export const ProductMixPage = () => {
    const {fetchProducts} = useProductStore();
    const {fetchIngredients} = useIngredientStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // const {conversions} = useConversionStore();
    const {conversionBatches} = useConversionBatchStore();
    // productMixes state is managed locally here. If it needs to be global, consider a Zustand store.
    const [productMixes, setProductMixes] = useState<ProductMix[]>([]);

    const conversions = (conversionBatches ?? []).flatMap((batch) =>
        batch.conversions.map((conversion) => ({
            ...conversion,
            batchId: batch.id,
            batchName: batch.name,
            batchActive: batch.active,
        }))
    );


    useEffect(() => {
        // Fetch initial data needed for creating mixes (ingredients, product templates)
        // These fetches might ideally happen when this ProductMixPage is first rendered or becomes relevant.
        fetchIngredients();
        fetchProducts();
    }, [fetchIngredients, fetchProducts]);

    // Handler for when a new mix is created by CreateNewProductMix
    const handleNewMixCreated = (newMix: ProductMix) => {
        setProductMixes(prevMixes => [...prevMixes, newMix]);
        // Optionally, you could close the modal after a new mix is created,
        // or keep it open to add more or view existing ones.
        // setIsModalOpen(false);
    };

    // Handler to update the list of product mixes (e.g., after an edit or delete within ExistingProductMixes)
    // This would be needed if ExistingProductMixes modifies its own list and needs to inform the parent.
    /*const handleProductMixesUpdated = (updatedMixes: ProductMix[]) => {
        setProductMixes(updatedMixes);
    };*/

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                {/* ... (Trigger button code remains the same) ... */}

                {conversions && conversions.length > 0 ? (
                    <Button variant="default" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Product Mixes
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Product Mixes (No Ingredients)
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                style={{width: "100vw"}}
                className="
                      p-0 w-screen max-w-screen h-screen max-h-screen
                        top-0 left-0 translate-x-0 translate-y-0
                        rounded-none border-none /* Or just border-0 */
                        flex flex-col
                    "
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus on first element if not desired
            >
                <DialogHeader className="p-4 sm:p-6 border-b sticky top-0 bg-background z-10"> {/* Sticky header */}
                    <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <Blend className="h-5 w-5 sm:h-6 sm:w-6 text-primary"/>
                        Product Mix
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Create new product mixes or view/manage existing ones for this production run.
                    </DialogDescription>
                </DialogHeader>

                {/* Use Shadcn ScrollArea for the main content if preferred, or simple overflow-y-auto */}
                <ScrollArea className="flex-grow p-4 sm:p-6"> {/* flex-grow makes it take available space */}
                    <div className="space-y-6">
                        {/* Section for creating a new product mix */}
                        <div
                            className="border-b pb-6 last:border-b-0"> {/* last:border-b-0 if it's the only section potentially */}
                            <h3 className="text-base sm:text-lg font-semibold mb-3 text-foreground">Create New Product
                                Mix</h3>
                            <CreateNewProductMix
                                onCreate={handleNewMixCreated}
                            />
                        </div>

                        {/* Section for existing product mixes */}
                        <div> {/* Removed border-b here, assuming it's the last section or sections handle their own separation */}
                            <h3 className="text-base sm:text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                                <ListOrdered className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"/>
                                Existing Product Mixes
                                {productMixes.length > 0 && <span
                                    className="text-xs sm:text-sm text-muted-foreground">({productMixes.length})</span>}
                            </h3>
                            <ExistingProductMixes
                                productMixes={productMixes}

                            />
                        </div>
                    </div>
                </ScrollArea>

                {/* Optional Footer */}
                <DialogFooter className="p-4 sm:p-6 border-t sticky bottom-0 bg-background z-10"> {/* Sticky footer */}
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">Close</Button>
                    </DialogClose>
                    {/* Add other footer buttons if needed, e.g., a global "Save All Changes" if applicable */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};