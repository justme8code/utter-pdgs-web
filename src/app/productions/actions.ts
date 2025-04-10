'use server';
import {myRequest} from "@/app/api/axios";
import {ExtendedProductionResponse, Production, ProductionResponse, StaffResponse} from "../data_types";
import {makeAuthRequest, verifySession} from "@/app/actions";
import {ProductPayload} from "@/app/productions/CreateProduct";
import {ProductMixDataType} from "@/app/product";


export async function fetchProductions(page: number, size: number) {
    const token = await verifySession();
    return await myRequest<null,ProductionResponse[]>({
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
    const data = await myRequest<Production, ProductionResponse|string>({
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

export async function deleteProduction(id: number) {

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


export async function createProduct(product:ProductPayload){
    const {data,status} = await makeAuthRequest<ProductPayload,ProductPayload>({
        url: `/products`,
        method: "POST",
        data: product,
    })

    return {data, status:status === 201 };
}


export async function getProducts(){
    const {data,status} = await makeAuthRequest<null,ProductPayload>({
        url: `/products`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}

export async function createProductMix(productMix:ProductMixDataType){
    const {data,status} = await makeAuthRequest<ProductMixDataType,ProductMixDataType>({
        url: `/product-mixes`,
        method: "POST",
        data: productMix
    });
    return {data:data,status:status === 201 };
}

export async function updateProductMix(productMix:ProductMixDataType){
    const {data,status} = await makeAuthRequest<ProductMixDataType,ProductMixDataType>({
        url: `/product-mixes/${productMix.id}`,
        method: "PUT",
        data: productMix
    });
    return {data:data,status:status === 200 };
}

export async function deleteProductMix(id:number){
    const {data,status} = await makeAuthRequest<ProductMixDataType,ProductMixDataType>({
        url: `/product-mixes/${id}`,
        method: "DELETE"
    });
    return {data:data,status:status === 200 };
}

export async function fetchProductionMixes(productionId:number){
    const {data,status} = await makeAuthRequest<number,ProductMixDataType[]>({
        url: `/productions/${productionId}/product-mixes`,
        method: "GET",
    });
    return {data:data,status:status === 200 };

}