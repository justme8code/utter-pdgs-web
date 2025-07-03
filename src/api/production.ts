'use server';
import {makeAuthRequest} from "@/lib/session";
import {Conversion, Production, ProductMix, Purchase} from "@/app/types";

export async function fetchProductions(page: number, size: number) {
    const {data,error} = await makeAuthRequest<null, Production[]>({
        url: `/productions?page=${page}&size=${size}`,
        method: "GET"
    });
    return {
        data:data??[],
        error
    }
}


export async function createProduction(production: { name: string, startDate: string, endDate: string }) {
    const {data,status,error} = await makeAuthRequest<{ name: string, startDate: string, endDate: string },Production>({
        url: `/productions`,
        method: "POST",
        data:production
    })
    return {data:data,status,error}
}

export async function fetchProduction(id: number) {
    const {data, status, error} = await makeAuthRequest<number, Production>({
        url: `/productions/${id}`,
    });
    return {data: data ?? null, status: status === 200, error: error}
}

export async function fetchProductionMixes(productionId: number) {
    const {data, status} = await makeAuthRequest<number, ProductMix[]>({
        url: `/productions/${productionId}/product-mixes`,
        method: "GET",
    });
    return {data: data, status: status === 200};
}

export async function fetchProductionFullData(productionId: number) {
    const {data, status} = await makeAuthRequest<number, {
        production: Production,
        purchases: Purchase[],
        conversions: Conversion[]
    }>({
        url: `/productions/${productionId}/complete`,
        method: "GET",
    });
    return {data: data, status: status === 200};
}

export async function finishProduction(productionId: number) {
    const {status} = await makeAuthRequest<null, null>({
        url: `/productions/${productionId}/finalize`,
        method: "POST",
    });
    return {status: status === 204};
}

// MODIFIED to return the data
export async function nonFinalizedProductions() {
    // The generic type now expects Production[] as the data payload
    const {status, data} = await makeAuthRequest<null, Production[]>({
        url: `/productions/non-finalized`,
        method: "GET",
    });

    // Return the data if the request was successful, otherwise null or an empty array
    return {
        success: status === 200,
        data: data || null,
    };
}


// Delete production
export async function  deleteProduction(id: number) {
    const {status} = await makeAuthRequest<null, null>({
        url: `/productions/${id}`,
        method: "DELETE",
    })
    return {status: status === 200};
}



