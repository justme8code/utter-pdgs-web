import {Ingredient} from "./ingredient";

export interface ConversionField {
    id: number | null;
    kgUsed: number | undefined | string;
    productionLitresLost: number | undefined | string;
    outPutLitres: number | undefined | string;
    usableLitres: number | undefined | string;
    litresPerKg: number | undefined | string;
    costPerLitre: number | undefined | string;
    rawBrix: number | undefined | string;
    ingredient: Ingredient | null;
}

export interface Conversion {
    id: number | null;
    batch: number;
    productionId: number;
    purchaseId: number;
    createdAt?: string;
    fields: ConversionField[];
}
