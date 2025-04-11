'use server';
import { makeAuthRequest } from "../actions";
export interface InsightDataType {
    totalQtyOfRawMaterials: number;
    totalCostOfPurchases: number;
    avgCostOfPurchases: number;
    totalProductionLost: number;
    mostPurchasedRawMaterials: string;
    top3PurchasedRawMaterials: Array<{ name: string; count: number }>;
}

export interface DataGrowthDto {
    date: string;
    newProductions: number;
    newProductMixes: number;
}


export async function fetchLevel1DataInsight(){
    const {data,status} = await makeAuthRequest<null,InsightDataType>({
        url: `/insights/level1-data`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}


export async function fetchDataGrowthInsight(startDate:string,endDate:string){
    const {data,status} = await makeAuthRequest<null,DataGrowthDto[]>({
        url: `/insights/data-growth?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}