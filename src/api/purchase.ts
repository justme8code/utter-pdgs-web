'use server';

import {makeAuthRequest} from "@/lib/session";
import {ProductionStore, Purchase} from "@/app/types";

export async function createPurchase(productionId: number, purchase: Purchase) {
    const {data, status, error} = await makeAuthRequest<Purchase, {
        productionStore: ProductionStore,
        purchase: Purchase
    }>({
        url: `/productions/${productionId}/purchase-entries`,
        method: "POST",
        data: purchase
    });
    return {data: data, status: status === 201, error: error};
}



