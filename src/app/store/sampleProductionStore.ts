
import { SampleProduction, SamplePurchaseEntries, SampleMaterialToIngredients } from '../new/play-with-data';
import {create} from "zustand";

interface SampleProductionState {
  production: SampleProduction;
  setProduction: (production: SampleProduction) => void;
  addPurchaseEntry: (entry: SamplePurchaseEntries) => void;
  updatePurchaseEntry: (id: number | string, updatedEntry: Partial<SamplePurchaseEntries>) => void;
  removePurchaseEntry: (id: number | string) => void;
  addMaterialToIngredient: (ingredient: SampleMaterialToIngredients) => void;
  updateMaterialToIngredient: (id: number | string, updatedIngredient: Partial<SampleMaterialToIngredients>) => void;
  removeMaterialToIngredient: (id: number | string) => void;
}

const useSampleProductionStore = create<SampleProductionState>((set) => ({
  production: {
    id: undefined,
    productionBatches: [],
    purchaseEntries: [],
    materialToIngredients: [],
  },
    setProduction: (production) => set({ production }),
    addPurchaseEntry: (entry) =>
        set((state) => ({
        production: {
            ...state.production,
            purchaseEntries: [...(state.production.purchaseEntries || []), entry],
        },
        })),
  updatePurchaseEntry: (id, updatedEntry) =>
    set((state) => ({
      production: {
        ...state.production,
        purchaseEntries: state.production.purchaseEntries?.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ),
      },
    })),
  removePurchaseEntry: (id) =>
    set((state) => ({
      production: {
        ...state.production,
        purchaseEntries: state.production.purchaseEntries?.filter((entry) => entry.id !== id),
      },
    })),
    addMaterialToIngredient: (materialToIngredient) => set(
        (state) => ({
            production: {
                ...state.production,
                materialToIngredients: [
                    ...(state.production.materialToIngredients || []),
                    {
                        ...materialToIngredient
                    },
                ],
            },
        })
    ),
  updateMaterialToIngredient: (id, updatedIngredient) =>
    set((state) => ({
      production: {
        ...state.production,
        materialToIngredients: state.production.materialToIngredients?.map((ingredient) =>
          ingredient.id === id ? { ...ingredient, ...updatedIngredient } : ingredient
        ),
      },
    })),
  removeMaterialToIngredient: (id) =>
    set((state) => ({
      production: {
        ...state.production,
        materialToIngredients: state.production.materialToIngredients?.filter((ingredient) => ingredient.id !== id),
      },
    })),
}));

export default useSampleProductionStore;
