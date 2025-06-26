'use server';
import {Staff} from "@/app/types";
import {makeAuthRequest} from "@/lib/session";

export async function fetchStaffs() {
    return await makeAuthRequest<null, Staff[]>({
        url: `/users/staffs`,
        method: "GET",
    });
}