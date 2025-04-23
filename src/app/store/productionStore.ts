import { create } from 'zustand'
import {SampleProduction} from "@/app/new/play-with-data";


// Zustand store for managing a single selected production
type ProductionStore = {
    selectedProduction: SampleProduction | null;
    loading: boolean;
    setSelectedProduction: (production: SampleProduction) => void;
    updateProductionStatus: (status: "RUNNING" | "COMPLETED" | "STOPPED") => void;
    setLoading: (loading: boolean) => void;
    resetSelectedProduction: () => void;
};

export const useProductionStore = create<ProductionStore>((set) => ({
    selectedProduction: null,
    loading: false,
    setSelectedProduction: (production) => set({ selectedProduction: production }),
    updateProductionStatus: (status) => set((state) => ({
        selectedProduction: state.selectedProduction
            ? { ...state.selectedProduction, status }
            : null
    })),
    setLoading: (loading) => set({ loading }),
    resetSelectedProduction: () => set({ selectedProduction: null }),
}));

