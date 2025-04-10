// src/store/productStore.ts
import { create } from "zustand";
import { ProductPayload } from "../product";
import { createProduct, getProducts } from "@/app/productions/actions";

interface ProductState {
    products: ProductPayload[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    addProduct: (payload: ProductPayload) => Promise<void>;
}

function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "An unexpected error occurred";
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, status } = await getProducts();
            if (status) {
                set({ products: data, isLoading: false });
            } else {
                set({ error: "Failed to fetch products", isLoading: false });
            }
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err), isLoading: false });
        }
    },

    addProduct: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data, status } = await createProduct(payload);
            if (status) {
                set((state) => ({
                    products: [...state.products, data],
                    isLoading: false,
                }));
            } else {
                set({ error: "Failed to add product", isLoading: false });
            }
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err), isLoading: false });
        }
    },
}));
