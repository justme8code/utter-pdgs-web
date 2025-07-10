import {ConversionBatch} from "@/app/types/new";
import {create} from "zustand";
import {Conversion} from "@/app/types";

type ConversionBatchStore = {
    conversionBatches: ConversionBatch[];
    setConversionBatches: (batches: ConversionBatch[]) => void;
    addBatch: (batch: ConversionBatch) => void;
    updateBatch: (batchId: number, updated: Partial<ConversionBatch>) => void;
    removeBatch: (batchId: number) => void;
    clearBatches: () => void;
    setActiveBatch: (batchId: number) => void;
    addConversionToBatch: (batchId: number,conversion:Conversion) => void;

};

export const useConversionBatchStore = create<ConversionBatchStore>((set) => ({
    conversionBatches: [],

    setConversionBatches: (batches) => set({conversionBatches: batches}),

    addBatch: (batch) =>
        set((state) => ({
            conversionBatches: [...state.conversionBatches, batch],
        })),

    updateBatch: (batchId, updated) =>
        set((state) => ({
            conversionBatches: state.conversionBatches.map((b) =>
                b.id === batchId ? {...b, ...updated} : b
            ),
        })),

    removeBatch: (batchId) =>
        set((state) => ({
            conversionBatches: state.conversionBatches.filter(
                (b) => b.id !== batchId
            ),
        })),

    clearBatches: () => set({conversionBatches: []}),
    setActiveBatch: (id: number) =>
        set((state) => ({
            conversionBatches: state.conversionBatches.map((batch) => ({
                ...batch,
                active: batch.id === id, // Only this one is active
            }))
        })),

    addConversionToBatch: (batchId: number, conversion: Conversion) => {
        set(state => ({
            conversionBatches: state.conversionBatches.map(batch =>
                batch.id === batchId
                    ? { ...batch, conversions: [...batch.conversions, conversion] }
                    : batch
            )
        }));
    }

}));