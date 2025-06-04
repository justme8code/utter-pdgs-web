import {Ingredient} from "@/app/types/ingredient";

export interface Product {
    id?:number;
    name: string;
    description: string;
    unitOfMeasure: string;
    totalProductMixCount?:number;
    ingredients: Ingredient[];
}