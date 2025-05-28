'use server';

import {makeAuthRequest} from "@/app/actions/main";
import {ProductionStore, ProductMix, ProductMixOutput} from "../types";

export async function createProductMix(productionId:number,productMix:ProductMix){
    const {data,status,error} = await makeAuthRequest<ProductMix,{ productMix:ProductMix,productionStore:ProductionStore}>({
        url: `/productions/${productionId}/product-mixes`,
        method: "POST",
        data: productMix
    });
    return {data:data,status:status===201,message:status===201?"Product Mix Created":"Failed to create product mix"};
}

export async function updateProductMix(productionId:number,productMix:ProductMix){
    const {data,status} = await makeAuthRequest<ProductMix,ProductMix>({
        url: `/productions/${productionId}/product-mixes/${productMix.id}`,
        method: "PUT",
        data: productMix
    });
    return {data:data,status:status === 200 };
}

export async function deleteProductMix(productionId:number,id:number){
    const {data,status} = await makeAuthRequest<ProductMix,ProductMix>({
        url: `/productions/${productionId}/product-mixes/${id}`,
        method: "DELETE"
    });
    return {data:data,status:status === 200 };
}


export async function getProductMixOutputs(productionId:number){
    const {data,status} = await makeAuthRequest<null,ProductMixOutput[]>({
        url: `/productions/${productionId}/product-mix-outputs`,
        method: "GET"
    });
    return {data:data,status:status === 200 };
}