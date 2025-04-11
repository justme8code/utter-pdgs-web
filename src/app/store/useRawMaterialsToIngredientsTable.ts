import { DataType } from "@/app/components/production/EditableTable";
import { create } from "zustand";

type RawMaterialsToIngredientsStore = {
    rTable: DataType[];
    updateRTable: (rTable: DataType[]) => void;
};

const usePopulatePurchasesStore = create<RawMaterialsToIngredientsStore>((set) => ({
    rTable: [],
    updateRTable: (rTable: DataType[]) => set({ rTable }),
}));

export default usePopulatePurchasesStore;
