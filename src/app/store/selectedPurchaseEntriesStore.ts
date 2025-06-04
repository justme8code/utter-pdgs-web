import {create} from 'zustand';

type SelectedPurchaseEntriesState = {
    productionId: number | null;
    purchaseEntryIds: Array<string|number>;
    setProductionId: (id: number | null) => void;
    addPurchaseEntryId: (id: number) => void;
    removePurchaseEntryId: (id: number) => void;
    clearPurchaseEntryIds: () => void;
    setPurchaseEntries: (ids: Array<number|string>) => void;
};

const useSelectedPurchaseEntriesStore = create<SelectedPurchaseEntriesState>((set) => ({
    productionId: null,
    purchaseEntryIds: [],
    setProductionId: (id) => set({ productionId: id }),
    addPurchaseEntryId: (id) =>
        set((state) => ({
            purchaseEntryIds: [...state.purchaseEntryIds, id],
        })),
    removePurchaseEntryId: (id) =>
        set((state) => ({
            purchaseEntryIds: state.purchaseEntryIds.filter((entryId) => entryId !== id),
        })),
    clearPurchaseEntryIds: () => set({ purchaseEntryIds: [] }),
    setPurchaseEntries: (ids) => set({ purchaseEntryIds: ids }),
}));

export default useSelectedPurchaseEntriesStore;

