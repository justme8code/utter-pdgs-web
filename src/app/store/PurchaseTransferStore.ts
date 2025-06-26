// src/app/store/usePurchaseTransferStore.ts
import {create} from 'zustand';
import {PurchaseTransfer} from '@/app/types';

type PurchaseTransferStore = {
    setPurchaseTransfers: (purchases: PurchaseTransfer[]) => void;
    purchaseTransfers: PurchaseTransfer[];
    addPurchaseTransfer: (purchase: PurchaseTransfer) => void;
    removePurchaseTransfer: (id: number) => void;
    clearPurchaseTransfers: () => void;
    updatePurchaseTransfer: (id: number, updated: Partial<PurchaseTransfer>) => void;
};

export const usePurchaseTransferStore = create<PurchaseTransferStore>((set) => ({
    purchaseTransfers: [],

    addPurchaseTransfer: (purchase) =>
        set((state) => ({
            purchaseTransfers: [...state.purchaseTransfers, purchase],
        })),

    removePurchaseTransfer: (id) =>
        set((state) => ({
            purchaseTransfers: state.purchaseTransfers.filter((p) => p.id !== id),
        })),

    updatePurchaseTransfer: (id, updated) =>
        set((state) => ({
            purchaseTransfers: state.purchaseTransfers.map((p) =>
                p.id === id ? {...p, ...updated} : p
            ),
        })),

    clearPurchaseTransfers: () => set({purchaseTransfers: []}),
    setPurchaseTransfers: (purchaseTransfers) => set({purchaseTransfers}),
}));
