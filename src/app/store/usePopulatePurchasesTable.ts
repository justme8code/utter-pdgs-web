import { DataType } from "@/app/components/production/EditableTable";
import { create } from "zustand";

type PopulatePurchasesStore = {
    table: DataType[];
    updateTable: (table: DataType[]) => void;
};

const usePopulatePurchasesStore = create<PopulatePurchasesStore>((set) => ({
    table: [],
    updateTable: (table: DataType[]) => set({table}),
}));

export default usePopulatePurchasesStore;
