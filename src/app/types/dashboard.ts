import {Production} from "@/app/types/production";

export interface ProductionOverviewData {
    totalProductions: number;
    productionsInProgress: Production[];
    recentProductions: Production[];
}


export interface InventoryDashboardData {
    ingredientTotalLitres: number;
    rawMaterialTotalLitres: number;
    lowStockIngredients: LowStockIngredient[];
    lowStockRawMaterials: LowStockRawMaterial[];
    ingredientBreakdown: IngredientInStore[];
    rawMaterialBreakdown: RawMaterialInStore[];
}

export interface LowStockIngredient {
    id: number;
    ingredient: {
        name: string;
    };
    usableLitresLeft: number;
}

export interface LowStockRawMaterial {
    // If you're not sure what this looks like yet, you can update later.
    // Here's a safe base assuming it might mirror LowStockIngredient:
    id?: number;
    rawMaterial?: {
        name: string;
    };
    usableQtyLeft?: number;
}

export interface IngredientInStore {
    ingredientName: string;
    totalLitres: number;
}

export interface RawMaterialInStore {
    rawMaterialName: string;
    totalQty: number;
}
