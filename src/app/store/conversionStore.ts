import {create} from 'zustand'
import {Conversion} from "@/app/types"

// Zustand store for managing conversions
type ConversionStore = {
    conversions: Conversion[];
    setConversions: (conversions: Conversion[]) => void;
    addConversion: (conversion: Conversion) => void;
    updateConversion: (conversion: Conversion) => void;
    deleteConversion: (id: number) => void;
};

export const useConversionStore = create<ConversionStore>((set) => ({
    conversions: [],

    setConversions: (conversions) => set({conversions}),

    addConversion: (conversion) =>
        set((state) => ({
            conversions: [...state.conversions, conversion],
        })),

    updateConversion: (updatedConversion) =>
        set((state) => ({
            conversions: state.conversions.map((c) =>
                c.id === updatedConversion.id ? updatedConversion : c
            ),
        })),

    deleteConversion: (id) =>
        set((state) => ({
            conversions: state.conversions.filter((c) => c.id !== id),
        })),
}));
