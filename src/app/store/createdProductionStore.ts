// store/productionStore.ts
import { create } from 'zustand'
import {fetchProductionWithDynamicData} from "@/app/actions/production";
import {ExtendedProductionResponse} from "@/app/data_types";



interface ProductionState {
    production: ExtendedProductionResponse | null;
    setProduction: (data: ExtendedProductionResponse) => void;
    clearProduction: () => void;
    fetchP: (id: number) => Promise<void>;
}

export const useCreateProductionStore = create<ProductionState>((set) => ({
    production: null,
    setProduction: (data) => set({ production: data }),
    clearProduction: () => set({ production: null }),
    fetchP: async (id: number) => {
        try {
            const {data,status} = await fetchProductionWithDynamicData(id);
            if (status && data) {
                set({ production: data });
            }

        } catch (error) {
            console.error('[Zustand] fetchProduction error:', error);
            set({ production: null });
        }
    }
}))
