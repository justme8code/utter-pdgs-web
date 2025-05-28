import {create} from "zustand";
import {addNewMaterial, getAllRawMaterials} from "@/app/actions/inventory";
import {RawMaterial} from "@/app/components/inventory/RawMaterials";


type RawMaterialStore = {
    rawMaterials: RawMaterial[];
    fetchRawMaterials: () => Promise<void>;
    createSupplier: (rawMaterial:RawMaterial) => Promise<void>;
};

const useSupplierStore = create<RawMaterialStore>((set) => ({
    rawMaterials: [],
    fetchRawMaterials: async () => {
        try {
            const {data,status} = await getAllRawMaterials();
            if(status){
                set({ rawMaterials: data});
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    },
    createSupplier: async (rawMaterial) => {
        try {
            const {data,status} = await addNewMaterial( [rawMaterial]);
            if (status) {
                set({ rawMaterials: data});
            }
        } catch (error) {
            console.error("Error creating supplier:", error);
        }
    },
}));

export default useSupplierStore;