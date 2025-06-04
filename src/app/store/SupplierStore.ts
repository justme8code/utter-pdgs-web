import {create} from "zustand";
import {createSuppliers, getAllSuppliers} from "@/app/actions/inventory";
import {Supplier} from "@/app/types";




type SupplierStore = {
    suppliers: Supplier[];
    fetchSuppliers: () => Promise<void>;
    createSupplier: (newSupplier: Supplier) => Promise<void>;
};

const useSupplierStore = create<SupplierStore>((set) => ({
    suppliers: [],
    fetchSuppliers: async () => {
        try {
            const {data,status} = await getAllSuppliers();
            if(status){
                set({ suppliers: data});
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    },
    createSupplier: async (newSupplier) => {
        try {
            const {data,status} = await createSuppliers(newSupplier);
            if (status) {
                set((state) => ({
                    suppliers: [...state.suppliers, data],
                }));
            }
        } catch (error) {
            console.error("Error creating supplier:", error);
        }
    },
}));

export default useSupplierStore;