// app/store/ingredientStore.ts (Assuming this is the path)
import {create} from 'zustand';
import {getAllIngredients} from "@/api/inventory"; // Assuming correct path
import {Ingredient} from "@/app/types";

interface IngredientState {
    ingredients: Ingredient[];
    isLoading: boolean; // New loading state
    error: string | null;   // New error state
}

interface IngredientActions {
    fetchIngredients: () => Promise<void>;
    setIngredients: (ings: Ingredient[]) => void; // Use this for manually setting, e.g., after an optimistic update or specific scenario
    clearError: () => void; // Action to clear errors
}

type IngredientStore = IngredientState & IngredientActions;

export const useIngredientStore = create<IngredientStore>((set) => ({
    // Initial State
    ingredients: [],
    isLoading: false, // Initialize isLoading to false
    error: null,      // Initialize error to null

    // Actions
    fetchIngredients: async () => {
        set({isLoading: true, error: null}); // Set loading true, clear previous error
        try {
            const {data, status, error: apiError} = await getAllIngredients(); // Assuming getAllIngredients might return an error object
            if (status && data) {
                set({ingredients: data, isLoading: false});
            } else {
                const errorMessage = apiError?.message || "Failed to fetch ingredients.";
                console.error('Error fetching ingredients from API:', apiError || "Status indicated failure or no data.");
                set({isLoading: false, error: errorMessage});
            }
        } catch (error: unknown) { // Catching unknown error type
            if (error instanceof Error) {
                const errorMessage = error?.message || "An unexpected error occurred while fetching ingredients.";
                console.error('Network or unexpected error fetching ingredients:', error);
                set({isLoading: false, error: errorMessage});
            } else {
                set({isLoading: false, error: "An unexpected error occurred while fetching ingredients."});
            }

        }
    },

    setIngredients: (ings: Ingredient[]) => {
        // When setting ingredients directly, you might want to consider the loading/error state.
        // For instance, if this is a result of a successful manual update, set loading to false and error to null.
        set({ingredients: ings, isLoading: false, error: null});
    },

    clearError: () => {
        set({error: null});
    }
}));