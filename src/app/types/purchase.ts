import {RawMaterial} from "./rawMaterial";
import {Supplier} from "./supplier";

export interface PurchaseUsage {
    id?: number | null;
    usableWeightLeft: number;
    totalKgUsed: number;
}

export interface Purchase {
    id?: number | null;
    productionLostWeight?: number
    uomQty?: number
    weight?: number
    usableWeight?: number
    cost?: number
    avgCost?: number
    avgWeightPerUOM?: number
    rawMaterial?: RawMaterial;
    transferred?: boolean;
    supplier?: Supplier;
    purchaseUsage?: PurchaseUsage;
}

export interface PurchaseTransfer {
    id: number;
    purchase: {
        rawMaterialName: string;
        rawMaterialUom: string;
        cost: number;
        purchaseUsageUsableWeightLeft: number;
        purchaseUsageTotalKgUsed: number;
    }
    fromProductionId: number;
    fromProductionName: string;
    transferred: boolean;
    transferNotes: boolean;
}



