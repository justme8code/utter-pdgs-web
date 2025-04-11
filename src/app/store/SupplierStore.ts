import { create } from "zustand";
import { Supplier } from "../data_types";
import {createSuppliers, getAllSuppliers} from "@/app/inventory/actions";


export  type NewSupplier = {
    fullName: string;
    address: string;
    phoneNumber: string;
    emailAddress: string;
};

type SupplierStore = {
    suppliers: Supplier[];
    fetchSuppliers: () => Promise<void>;
    createSupplier: (newSupplier: NewSupplier) => Promise<void>;
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