type WeightLossParams = {
    weight: string | number;
    productionLostWeight: string | number;
};

type CostParams = {
    cost: string | number;
    weight: string | number;
};

type UOMParams = {
    weight: string | number;
    qty: string | number;
};

/*type LitresPerKgParams = {
    outputLitres: string | number;
    totalUsable: string | number;
};


type CostPerLitreParams = {
    cost: string | number;
    usableWeight: string | number;
    density: string | number;
};*/

type ConversionParams = {
    usableLitres: string | number;
    totalUsable: string | number;
}

type CostParam2 = {
    totalCost:string | number,
    usableLitres: string | number;
}


function toNumber(value: string | number): number {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
}

function formatNumber(value: number): number {
    return Number.isFinite(value) ? parseFloat(value.toFixed(2)) : 0;
}

// Function to calculate usable weight
export function calculateUsableWeight({ weight, productionLostWeight }: WeightLossParams): number {
    const val = toNumber(weight) - toNumber(productionLostWeight);
    return formatNumber(val);
}

// Function to calculate average cost per kg based on total weight
export function calAverageCostPerKgBasedOnTotalWeight({ cost, weight }: CostParams): number {
    const weightNum = toNumber(weight);
    if (weightNum === 0) return 0; // Prevent division by zero

    const val = toNumber(cost) / weightNum;
    return formatNumber(val);
}

// Function to calculate average weight per UoM based on total weight
export function calAverageWeightPerUOMBasedOnTotalWeight({ weight, qty }: UOMParams): number {
    const qtyNum = toNumber(qty);
    if (qtyNum === 0) return 0; // Prevent division by zero

    const val = toNumber(weight) / qtyNum;
    return formatNumber(val);
}

// Function to calculate Litres per Kg
export function calculateLitresPerKg({ usableLitres, totalUsable }: ConversionParams): number {
    const usableLitresNum = toNumber(usableLitres);
    const totalUsableNum = toNumber(totalUsable);
    if (totalUsableNum === 0) return 0;

    return formatNumber(usableLitresNum / totalUsableNum);
}

// Function to calculate Cost per Litre
export function calculateCostPerLitre({ totalCost, usableLitres }: CostParam2): number {
    const totalCostNum = toNumber(totalCost);
    const usableLitresNum = toNumber(usableLitres);
    if (usableLitresNum === 0) return 0;

    return formatNumber(totalCostNum / usableLitresNum);
}