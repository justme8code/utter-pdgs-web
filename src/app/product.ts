import { Ingredient } from "./components/inventory/RawMaterials";

export interface VariantPayload {
    id?:number;
    name: string;
    description: string;
}

export interface Product {
    id?:number;
    name: string;
    description: string;
    unitOfMeasure: string;
    totalProductMixCount?:number;
    ingredients: Ingredient[];
}
export interface IngredientUsage {
    ingredientId: number;
    litresUsed: number;
}
export interface ProductMix {
    id: number;
    productionId: number;
    productId: number;
    ingredientUsages: IngredientUsage[];
    totalLitersUsed: number;
    brixOnDiluent: number;
    initialBrix: number;
    finalBrix: number;
    initialPH: number;
    finalPH: number;
}
