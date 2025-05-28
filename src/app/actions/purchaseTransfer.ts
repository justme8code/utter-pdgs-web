'use server';

import {makeAuthRequest} from "@/app/actions/main";
import {Purchase, PurchaseTransfer} from "@/app/types";

export async function fetchPurchaseTransfers(){
    const {data,status} = await makeAuthRequest<null,PurchaseTransfer[]>({
        url: `/inventory/transfers`,
        method: "GET"
    });
    return {data:data,status:status === 200 };
}

export async function createPurchaseTransfer(productionId:number,purchaseToTransfer:number){
    const {data,status} = await makeAuthRequest<null,{purchaseTransfer:PurchaseTransfer,purchase:Purchase}>({
        url: `/inventory/transfers/productions/${productionId}?purchaseToTransfer=${purchaseToTransfer}`,
        method: "POST"
    });
    return {data:data,status:status === 200, message: status === 200 ? "Transaction successful" : "Transaction failed" };
}





