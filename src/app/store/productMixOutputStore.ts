import {ProductMixOutput} from "@/app/types";
import {create} from "zustand";


interface ProductMixOutputStore {
    productMixOutput: ProductMixOutput[];
    setProductMixOutputs: (productMixes: ProductMixOutput[]) => void;
    addProductMixOutput: (mix: ProductMixOutput) => void;
    updateProductMixOutput: (id: number | undefined, updatedFields: Partial<ProductMixOutput>) => void;
    removeProductMixOutput: (id: number | undefined) => void;
    reset: () => void;
}

export const useProductMixOutputStoreStore = create<ProductMixOutputStore>((set) => ({
    productMixOutput: [],

    setProductMixOutputs: (productMixes) => set({productMixOutput: [...productMixes]}),

    addProductMixOutput: (mix) =>
        set((state) => ({
            productMixOutput: [...state.productMixOutput, mix],
        })),

    updateProductMixOutput: (id, updatedFields) =>
        set((state) => ({
            productMixOutput: state.productMixOutput.map((mix) =>
                (mix.id !== undefined && id !== undefined ? mix.id === id : false)
                    ? {...mix, ...updatedFields}
                    : mix
            ),
        })),

    removeProductMixOutput: (id) =>
        set((state) => ({
            productMixOutput: state.productMixOutput.filter(
                (mix) => (mix.id !== undefined && id !== undefined ? mix.id !== id : true)
            ),
        })),

    reset: () => set(() => ({productMixOutput: []})),
}));
