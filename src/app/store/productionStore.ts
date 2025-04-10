import { create } from 'zustand'

// Define the ProductionResponse type
export type ProductionResponse = {
    createdAt: string;
    id: number;
    productionNumber: string;
    name: string;
    startDate: string;
    endDate: string;
    staff: {
        id: number;
        userId: number;
        userFullName: string;
        companyRole: string;
    };
    status: "RUNNING" | "COMPLETED" | "PAUSED";
};

// Zustand store for managing a single selected production
type ProductionStore = {
    selectedProduction: ProductionResponse | null;
    loading: boolean;
    setSelectedProduction: (production: ProductionResponse) => void;
    updateProductionStatus: (status: "RUNNING" | "COMPLETED" | "PAUSED") => void;
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

