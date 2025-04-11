// store/ingredientStore.ts
import { create } from 'zustand'
import { Ingredient } from "@/app/components/inventory/RawMaterials"

interface IngredientState {
    ingredients: Ingredient[]
    setIngredients: (ings: Ingredient[]) => void
}

export const useIngredientStore = create<IngredientState>((set) => ({
    ingredients: [],
    setIngredients: (ings: Ingredient[]) => {
        set({ ingredients: ings })
    }
}))
