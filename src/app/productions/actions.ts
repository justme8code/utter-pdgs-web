import {myRequest} from "@/app/api/axios";
import {Production, ProductionResponse, StaffResponse} from "../data_types";

export async function fetchProductions(page: number, size: number) {
    return await myRequest<null,ProductionResponse[]>({
        url: `/productions?page=${page}&size=${size}`,
        method: "GET",
    });
}


export async function fetchStaffs() {
    return await myRequest<null,StaffResponse[]>({
        url: `/users/staffs`,
        method: "GET",
    });
}

export async function createProduction(production: Production) {
    return await myRequest<Production, ProductionResponse>({
        url: `/productions/staffs/1`,
        method: "POST",
        data: production,
    });
}