import { Staff } from "./staff";
import {Ingredient} from "@/app/types/ingredient";

export type Production = {
    createdAt?: string;
    id?: number;
    productionNumber?: string;
    name: string;
    startDate: string;
    endDate: string;
    staff?: Staff;
    finalized:boolean;
    productionStore?:ProductionStore;
};

export type ProductionStore = {
    id?: number;
    productionId?: number;
    ingredientStores: IngredientStore[];
}

export type IngredientStore = {
    id?: number;
    ingredient: Ingredient;
    usableLitresLeft: number;
}
