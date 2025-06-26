import {Ingredient} from "./ingredient";

export interface RawMaterial {
    id?: number | null;
    name: string;
    uom: string;
    ingredients?: Ingredient[];
}
