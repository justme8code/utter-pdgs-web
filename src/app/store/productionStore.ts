import {create} from 'zustand'
import {Production} from "@/app/types";


// Zustand store for managing a single selected production
type ProductionStore = {
    selectedProduction: Production | null;
    loading: boolean;
    setSelectedProduction: (production: Production) => void;
    setLoading: (loading: boolean) => void;
    resetSelectedProduction: () => void;
};

export const useProductionStore = create<ProductionStore>((set) => ({
    selectedProduction: null,
    loading: false,
    setSelectedProduction: (production) => set({selectedProduction: production}),
    setLoading: (loading) => set({loading}),
    resetSelectedProduction: () => set({selectedProduction: null}),
}));

