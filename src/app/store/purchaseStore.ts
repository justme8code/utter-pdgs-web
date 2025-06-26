import {create} from 'zustand'
import {Purchase} from "@/app/types"
import {createPurchase} from "@/api/purchase";

// Zustand store for managing purchases
type PurchaseStore = {
    purchases: Purchase[];
    setPurchases: (purchases: Purchase[]) => void;
    addPurchase: (purchase: Purchase, productionId: number) => Promise<{ success: boolean; message: string; }>;
    updatePurchase: (purchase: Purchase) => void;
    deletePurchase: (purchase: Purchase) => void;
    getPurchase: (purchaseId: number) => Purchase;
};

export const usePurchaseStore = create<PurchaseStore>((set) => ({
    purchases: [],

    setPurchases: (purchases) => set({purchases}),

    addPurchase: async (purchase, productionId) => {
        try {
            const {data, status, error} = await createPurchase(productionId, purchase);
            if (status && data) {
                console.log(data);
                set((state) => ({
                    purchases: [...state.purchases, data.purchase],
                }));
                return {success: true, message: "Purchase created successfully"};
            } else {
                return {success: false, message: error.message ?? "Failed to create purchase"};
            }
        } catch (err: unknown) {
            console.error("Error adding purchase:", err);
            return {
                success: false,
                message: "Unknown error occurred while adding purchase",
            };
        }
    },


    updatePurchase: (updatedPurchase) =>
        set((state) => ({
            purchases: state.purchases.map((p) =>
                p.id === updatedPurchase.id ? updatedPurchase : p
            ),
        })),

    deletePurchase: (purchaseToDelete) =>
        set((state) => ({
            purchases: state.purchases.filter((p) => p.id !== purchaseToDelete.id),
        })),

    getPurchase: (purchaseId) => {
        const state: PurchaseStore = usePurchaseStore.getState();
        return state.purchases.find((p) => p.id === purchaseId)!;
    }

}));
