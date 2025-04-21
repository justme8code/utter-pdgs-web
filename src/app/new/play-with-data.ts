type SampleRawMaterial = {
    id?: number;
    name: string;
    uom: string;
};

type SampleIngredient = {
    id?: number;
    name: string;
};

type SampleSupplier = {
    id?: number;
    fullName?: string;
}

type SampleProductionBatches = {
    id?: number;
    name: string;
};

type SamplePurchaseEntries = {
    id?: number | string;
    rawMaterial: SampleRawMaterial;
    supplier: SampleSupplier;
    uom: string;
    qty: number;
    weight: number;
    productionLost: number;
    usable: number;
    cost: number;
    avgCost: number;
    avgWeightPerUOM: number;
};

type SampleMaterialToIngredients = {
    id?: number;
    purchaseEntry: {
        id?: number | string;
        rawMaterial: SampleRawMaterial;
    };
    totalUsable: number;
    productionLost: number;
    batch: number;
    litresPerKg: number;
    costPerLitre: number;
    ingredients: SampleIngredient[];
};

type SampleProduction = {
    id?: number;
    productionBatches?: SampleProductionBatches[];
    purchaseEntries?: SamplePurchaseEntries[];
    materialToIngredients?: SampleMaterialToIngredients[];
};

export type {
    SampleRawMaterial,
    SampleProduction,
    SampleProductionBatches,
    SamplePurchaseEntries,
    SampleMaterialToIngredients,
    SampleIngredient,
    SampleSupplier
};
