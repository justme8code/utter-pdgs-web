import {create} from "zustand";
import {addNewMaterial, getAllRawMaterials} from "@/api/inventory";
import {RawMaterial} from "@/app/types";


type RawMaterialStore = {
    rawMaterials: RawMaterial[];
    fetchRawMaterials: () => Promise<void>;
    createSupplier: (rawMaterial: RawMaterial) => Promise<void>;
};

const useSupplierStore = create<RawMaterialStore>((set) => ({
    rawMaterials: [],
    fetchRawMaterials: async () => {
        try {
            const {data, status} = await getAllRawMaterials();
            if (status && data) {
                set({rawMaterials: data});
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    },
    createSupplier: async (rawMaterial) => {
        try {
            const {data, status} = await addNewMaterial([rawMaterial]);
            if (status && data) {
                set({rawMaterials: data});
            }
        } catch (error) {
            console.error("Error creating supplier:", error);
        }
    },
}));

export default useSupplierStore;