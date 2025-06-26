'use server';
import {makeAuthRequest} from "@/lib/session";
import {Unitofmeasurement} from "@/app/types";

export async function createUOM(uom: Unitofmeasurement) {
    const {data, status, error} = await makeAuthRequest<Unitofmeasurement, Unitofmeasurement>({
        url: `/inventory/uoms`,
        method: "POST",
        data: uom
    });
    return {data: data, status: status === 201, error: error};
}

export async function updateUOM(uom: Unitofmeasurement) {
    const {data, status, error} = await makeAuthRequest<Unitofmeasurement, Unitofmeasurement>({
        url: `/inventory/uoms`,
        method: "PUT",
        data: uom
    });
    return {data: data, status: status === 200, error: error};
}

export async function fetchUOMS() {
    const {data, status, error} = await makeAuthRequest<null, Unitofmeasurement[]>({
        url: `/inventory/uoms`,
        method: "GET",
    });
    return {data: data, status: status === 200, error: error};
}

export async function deleteUOM(id: number) {
    const {status, error} = await makeAuthRequest<null, null>({
        url: `/inventory/uoms/${id}`,
        method: "DELETE",
    });
    return {status: status === 200, error: error};
}