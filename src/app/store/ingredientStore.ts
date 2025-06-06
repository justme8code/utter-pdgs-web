import {create} from 'zustand';
import {getAllIngredients} from "@/app/actions/inventory";
import {Ingredient} from "@/app/types";

interface IngredientState {
    ingredients: Ingredient[];
    fetchIngredients: () => Promise<void>;
    setIngredients: (ings: Ingredient[]) => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
    ingredients: [],

    // Fetch ingredients from an API
    fetchIngredients: async () => {
        try {
            const { data, status } = await getAllIngredients();
            if (status) {
                set({ ingredients: data });
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    },

    // Set ingredients directly
    setIngredients: (ings: Ingredient[]) => {
        set({ ingredients: ings });
    }
}));