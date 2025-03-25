'use server';
import {myRequest} from "@/app/api/axios";
import {ExtendedProductionResponse, Production, ProductionResponse, StaffResponse} from "../data_types";
import {makeAuthRequest, verifySession} from "@/app/actions";


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
