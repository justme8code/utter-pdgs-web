'use server';

import {makeAuthRequest} from "@/lib/session";
import {Purchase, PurchaseTransfer} from "@/app/types";

export async function fetchPurchaseTransfers() {
    const {data, status, error} = await makeAuthRequest<null, PurchaseTransfer[]>({
        url: `/inventory/transfers`,
        method: "GET"
    });
    return {data: data, status: status === 200, error: error};
}

export async function createPurchaseTransfer(productionId: number, purchaseToTransfer: number) {
    const {data, status, error: error} = await makeAuthRequest<null, {
        purchaseTransfer: PurchaseTransfer,
        purchase: Purchase
    }>({
        url: `/inventory/transfers/productions/${productionId}?purchaseToTransfer=${purchaseToTransfer}`,
        method: "POST"
    });
    return {
        data: data,
        status: status === 200,
        message: status === 200 ? "Transaction successful" : "Transaction failed",
        error: error
    };
}





