import { RawMaterial } from "./rawMaterial";

export interface Ingredient {
    id?: number | null;
    name: string;
    rawMaterials?: RawMaterial[];
}

export interface IngredientUsage {
    ingredientId: number;
    litresUsed: number;
}
