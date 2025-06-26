import {Ingredient} from "./ingredient";
import {Product} from "@/app/types/product";

export interface ProductMix {
    id?: number;
    productionId: number;
    productionName: string;
    productName: string;
    productId: number;
    productMixIngredients: ProductMixIngredient[];
    totalLitersUsed?: number;
    brixOnDiluent?: number;
    initialBrix?: number;
    finalBrix?: number;
    initialPH?: number;
    finalPH?: number;
    productCount: number;
}

export interface ProductMixIngredient {
    id?: number;
    ingredientId: number;
    litresUsed: number;
    ingredient?: Ingredient;
}

export interface ProductMixOutput {
    id?: number;
    product: Product;
    productMixIngredients: ProductMixIngredient[];
    totalLitersUsed?: number;
    brixOnDiluent?: number;
    initialBrix?: number;
    finalBrix?: number;
    initialPH?: number;
    finalPH?: number;
    productCount: number;
}