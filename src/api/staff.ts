'use server';
import {verifySession} from "@/lib/session";
import {myRequest} from "@/lib/axios";
import {Staff} from "@/app/types";

export async function fetchStaffs() {
    const token = await verifySession();
    return await myRequest<null, Staff[]>({
        url: `/users/staffs`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
}