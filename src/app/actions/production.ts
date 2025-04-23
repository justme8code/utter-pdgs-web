'use server';
import {myRequest} from "@/app/api/axios";
import {ExtendedProductionResponse, Pageable, Production, ProductionResponse, StaffResponse} from "../data_types";
import {makeAuthRequest, verifySession} from "@/app/actions/main";
import {ProductMix, Product} from "@/app/product";
import {SampleMaterialToIngredients, SampleProduction, SamplePurchaseEntries} from "@/app/new/play-with-data";


export async function fetchProductions(page: number, size: number) {
    const token = await verifySession();
    return await myRequest<null,SampleProduction[]>({
        url: `/productions?page=${page}&size=${size}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
}


export async function fetchStaffs() {
    const token = await verifySession();
    return await myRequest<null,StaffResponse[]>({
        url: `/users/staffs`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
}

export async function createProduction(production: Production) {
    const token = await verifySession();
    const data = await myRequest<Production, ProductionResponse>({
        url: `/productions`,
        method: "POST",
        data: production,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return {
        data: data.data,
        status:data.status,
        error:data.error,
    }
}

export async function fetchProduction(id: number) {
    const {data,status} = await makeAuthRequest<number,ProductionResponse>({
        url: `/productions/${id}`,
    });
    return {data:data,status:status}
}

export async function fetchProductionWithDynamicData(id: number) {
    const {data,status} = await makeAuthRequest<number,ExtendedProductionResponse>({
        url: `/productions/${id}/dynamic`,
    });
    return {data:data,status:status}
}

export async function updateProductionStatus(id:number,pStatus: "RUNNING" | "COMPLETED" | "Pause") {
    const {data,status} = await makeAuthRequest<number,ProductionResponse>({
        url: `/productions/${id}?status=${pStatus}`,
    });
    return {data:data,status:status}
}

export async function createProductionDynamicData<T>(
    productionId: number,
    dynamicData: Record<string, T>
) {
    const { status } = await makeAuthRequest<Record<string, T>, null>({
        url: `/productions/${productionId}/dynamic`,
        method: 'POST',
        data: dynamicData,
    });

    return { status: status === 201 };
}


export async function createProduct(product:Product){
    const {data,status} = await makeAuthRequest<Product,Product>({
        url: `/products`,
        method: "POST",
        data: product,
    })

    return {data, status:status === 201 };
}


export async function getProducts(){
    const {data,status} = await makeAuthRequest<null,Product[]>({
        url: `/products`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}

export async function createProductMix(productMix:ProductMix){
    const {data,status} = await makeAuthRequest<ProductMix,ProductMix>({
        url: `/product-mixes`,
        method: "POST",
        data: productMix
    });
    return {data:data,status:status === 201 };
}

export async function updateProductMix(productMix:ProductMix){
    const {data,status} = await makeAuthRequest<ProductMix,ProductMix>({
        url: `/product-mixes/${productMix.id}`,
        method: "PUT",
        data: productMix
    });
    return {data:data,status:status === 200 };
}

export async function deleteProductMix(id:number){
    const {data,status} = await makeAuthRequest<ProductMix,ProductMix>({
        url: `/product-mixes/${id}`,
        method: "DELETE"
    });
    return {data:data,status:status === 200 };
}

export async function fetchProductionMixes(productionId:number){
    const {data,status} = await makeAuthRequest<number,ProductMix[]>({
        url: `/productions/${productionId}/product-mixes`,
        method: "GET",
    });
    return {data:data,status:status === 200 };

}

// get production entries
export async function fetchProductionEntries(id:number){
        const {data,status} = await makeAuthRequest<number,SampleProduction>({
        url: `/productions/${id}/entries`,
        });
        return {data:data,status:status === 200 };
}


export async function updateProductionMaterialToIngredients(productionId:number,materialsToIngredients:SampleMaterialToIngredients[]){
    const {status} = await makeAuthRequest<SampleMaterialToIngredients[],null>({
        url: `/productions/${productionId}/entries/material-to-ingredients`,
        method: "PUT",
        data: materialsToIngredients
    });
    return {status:status === 200 };
}

export async function updateProductionPurchaseEntry (productionId:number,purchaseEntries:SamplePurchaseEntries[]){
    const {status} = await makeAuthRequest<SamplePurchaseEntries[],null>({
        url: `/productions/${productionId}/entries/purchase-entries`,
        method: "PUT",
        data: purchaseEntries
    });
    return {status:status === 200 };
}

export async function deleteProductionPurchaseEntry(productionId:number,purchaseEntriesId:number[]){
    const {status} = await makeAuthRequest<number[],null>({
        url: `/productions/${productionId}/entries/purchase-entries`,
        method: "DELETE",
        data: purchaseEntriesId
    });
    return {status:status === 200 };
}

export async function fetchProductMixes(page:number,size:number,search:string){
     const {data,status} = await makeAuthRequest<number[],Pageable<ProductMix>>({
         url: `/product-mixes/page?search=${search}&page=${page}&size=${size}`,
         method: "GET",
     });
     return {data:data,status:status === 200 };
}