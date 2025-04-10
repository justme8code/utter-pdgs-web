export interface VariantPayload {
    id?:number;
    name: string;
    description: string;
}

export interface ProductPayload {
    id?:number;
    name: string;
    description: string;
    unitOfMeasure: string;
    category: string;
    variant: VariantPayload;
}


interface Production {
    id: number;
}

interface Variant {
    name: string;
    description: string;
}

export interface Product {
    name: string;
    description: string;
    unitOfMeasure: string;
    category: string;
    variant: Variant;
}


export interface IngredientUsage {
    ingredientId: number;
    litresUsed: number;
}
export interface ProductMixDataType {
    id?: number;
    productionId?: number;
    productId?: number;
    ingredientUsages?: IngredientUsage[];
    totalLitersUsed?: number;
    qty?: number;
    brixOnDiluent?: number;
    initialBrix?: number;
    finalBrix?: number;
    initialPH?: number;
    finalPH?: number;
}
