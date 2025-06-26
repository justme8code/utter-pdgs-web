// app/store/SupplierStore.ts
import {create} from "zustand";
import {createSuppliers, getAllSuppliers} from "@/api/inventory";
import {Supplier} from "@/app/types";
import {ApiError} from "next/dist/server/api-utils";

// Define the shape of your store's state
interface SupplierState {
    suppliers: Supplier[];
    loading: boolean;
    error: string | null; // Store error messages from the store itself
}

// Define the actions your store can perform
interface SupplierActions {
    fetchSuppliers: () => Promise<void>;
    createSupplier: (newSupplierData: Omit<Supplier, 'id'>) => Promise<{
        success: boolean;
        data?: Supplier;
        error?: string
    }>;
    clearError: () => void;
}

type SupplierStore = SupplierState & SupplierActions;

const useSupplierStore = create<SupplierStore>((set) => ({
    suppliers: [],
    loading: false,
    error: null,

    // Actions
    fetchSuppliers: async () => {
        set({loading: true, error: null}); // Start loading, clear previous error
        try {
            const {data, status, error: apiError} = await getAllSuppliers();
            if (status && data) {
                set({suppliers: data, loading: false});
            } else {
                console.error("Error fetching suppliers from API:", apiError);
                set({loading: false, error: apiError.message || "Failed to fetch suppliers."});
            }
        } catch (error) {
            console.error("Network or unexpected error fetching suppliers:", error);
            set({loading: false, error: "An unexpected error occurred while fetching suppliers."});
        }
    },

    createSupplier: async (newSupplierData) => {
        set({loading: true, error: null});
        try {
            // Assuming apiError is of type { message: string; state: boolean } or similar
            const {data, status, error: apiError} = await createSuppliers(newSupplierData);
            if (status && data) {
                set((state) => ({
                    suppliers: [...state.suppliers, data],
                    loading: false,
                }));
                return {success: true, data};
            } else {
                const errorMessage = apiError?.message || "Failed to create supplier.";
                console.error("Error creating supplier from API:", apiError);
                set({loading: false, error: errorMessage}); // Set store error to the message string
                return {success: false, error: errorMessage}; // Return only the message string
            }
        } catch (error: unknown) { // Catch unknown errors
            if (error instanceof ApiError) {
                const errorMessage = error?.message || "An unexpected error occurred while creating the supplier.";
                console.error("Network or unexpected error creating supplier:", error);
                set({loading: false, error: errorMessage}); // Set store error to the message string
                return {success: false, error: errorMessage}; // Return only the message string
            }
            return {success: false, error: "An unexpected error occurred!"}; // Return only the message string
        }
    },
    // Placeholder for updateSupplier (you'll need to implement the API action)
    /*
    updateSupplier: async (supplierToUpdate) => {
        set({ loading: true, error: null });
        try {
            // const { data, status, error: apiError } = await updateSupplierAction(supplierToUpdate); // Your API call
            // For demonstration, simulate API call:
            await new Promise(resolve => setTimeout(resolve, 500));
            const status = true; // Simulate success
            const data = supplierToUpdate;
            const apiError = null;

            if (status && data) {
                set((state) => ({
                    suppliers: state.suppliers.map((s) => (s.id === data.id ? data : s)),
                    loading: false,
                }));
                return { success: true, data };
            } else {
                set({ loading: false, error: apiError || "Failed to update supplier." });
                return { success: false, error: apiError || "Failed to update supplier." };
            }
        } catch (error) {
            set({ loading: false, error: "An unexpected error occurred while updating the supplier." });
            return { success: false, error: "An unexpected error occurred while updating the supplier." };
        }
    },
    */

    // Placeholder for deleteSupplier (you'll need to implement the API action)
    /*
    deleteSupplier: async (supplierId) => {
        set({ loading: true, error: null });
        try {
            // const { status, error: apiError } = await deleteSupplierAction(supplierId); // Your API call
            // For demonstration, simulate API call:
            await new Promise(resolve => setTimeout(resolve, 500));
            const status = true; // Simulate success
            const apiError = null;

            if (status) {
                set((state) => ({
                    suppliers: state.suppliers.filter((s) => s.id !== supplierId),
                    loading: false,
                }));
                return { success: true };
            } else {
                set({ loading: false, error: apiError || "Failed to delete supplier." });
                return { success: false, error: apiError || "Failed to delete supplier." };
            }
        } catch (error) {
            set({ loading: false, error: "An unexpected error occurred while deleting the supplier." });
            return { success: false, error: "An unexpected error occurred while deleting the supplier." };
        }
    },
    */

    clearError: () => {
        set({error: null});
    }
}));

export default useSupplierStore;