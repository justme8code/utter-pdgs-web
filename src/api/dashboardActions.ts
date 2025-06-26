'use server';

import {makeAuthRequest} from "@/lib/session";
import {InventoryDashboardData, ProductionOverviewData} from "@/app/types";

export async function fetchProductionOverview() {
    const {data, status} = await makeAuthRequest<null, ProductionOverviewData>({
        url: `/dashboard/production-overview`,
        method: "GET",
    });
    return {data: data, status: status === 200};
}


export async function fetchInventoryDashboardData() {
    const {data, status, error} = await makeAuthRequest<null, InventoryDashboardData>({
        url: `/dashboard/inventory`,
        method: "GET",
    });
    return {data: data, status: status === 200, error: error};
}

