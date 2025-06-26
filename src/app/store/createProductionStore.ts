// store/productionStore.ts
import {create} from 'zustand'
import {Production} from "@/app/types";
import {fetchProduction} from "@/api/production";


interface ProductionState {
    production: Production | null;
    setProduction: (data: Production) => void;
    clearProduction: () => void;
    fetchP: (id: number) => Promise<void>;
}

export const useCreateProductionStore = create<ProductionState>((set) => ({
    production: null,
    setProduction: (data) => set({production: data}),
    clearProduction: () => set({production: null}),
    fetchP: async (id: number) => {
        try {
            const {data, status} = await fetchProduction(id);
            if (status && data) {
                set({production: data});
            }

        } catch (error) {
            console.error('[Zustand] fetchProduction error:', error);
            set({production: null});
        }
    }
}))