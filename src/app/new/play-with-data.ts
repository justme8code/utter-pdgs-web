type SampleRawMaterial = {
    id?: number;
    name: string;
    uom: string;
    ingredients: SampleIngredient[];
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
    id?: number | string
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
        id: number | string;
        rawMaterial: SampleRawMaterial;
        cost:number;
    };
    usable:number;
    totalUsable: number;
    litresLost: number;
    outPutLitres: number;
    batch: number;
    litresPerKg: number;
    costPerLitre: number;
    rawBrix: number;
};

type SampleProduction = {
    id: number;
    createdAt?: string;
    productionNumber?: string,
    name?: string,
    startDate?: string,
    endDate?: string,
    staff?:{
        id: number,
        userId: number,
        userFullName: string,
        companyRole:string
    },
    status?: "RUNNING" | "COMPLETED" | "PAUSED",
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
