'use server';
import {myRequest} from "@/app/api/axios";
import {Production, ProductionResponse, StaffResponse} from "../data_types";
import {verifySession} from "@/app/actions";


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
    return await myRequest<Production, ProductionResponse>({
        url: `/productions`,
        method: "POST",
        data: production,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
}