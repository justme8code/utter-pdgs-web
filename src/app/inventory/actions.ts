import { myRequest } from "@/app/api/axios";
import {useCallback} from "react";

type CreateUserRequest = {
    id?: number;
    fullName: string;
    staff: { profession: string; companyRole: string };
    pwd: string;
    email: string;
    phone: string;
    roles: { id?: number; name: string }[];
};

type Role = {
    id: number;
    userRole: string;
};

type FetchedUser = {
    id: number;
    fullName: string;
    email: string;
    roles: Role
};

export async function createUser(previousState: unknown, formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const profession = formData.get("profession") as string;
    const companyRole = formData.get("companyRole") as string;
    const password = formData.get("password") as string;
    let roles = formData.getAll("roles") as {name: string }[];

    // If roles are empty, assign the default role
    if (!roles || roles.length === 0) {
        roles = [{ name: "ROLE_USER" }];
    }

    if (!email || !password) {
        return { error: "Email or password is required" };
    }

    const createUserRequest: CreateUserRequest = {
        fullName,
        email,
        phone,
        pwd: password,
        staff: { profession, companyRole },
        roles,
    };

    const { status } = await myRequest<CreateUserRequest, null>({
        url: `/users`,
        method: "POST",
        data: createUserRequest,
    });

    return status === 201;
}


export async function fetchUsers  (){
    try {
        const { data, status } = await myRequest<null,FetchedUser[]>({
            method: "GET",
            url: `/users`,
            withCredentials: true
        });
        return {data:data, status:status===200}
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}


export async function fetchRoles(){
    try {
        const { data, status } = await myRequest<null, Role[]>({
            method: "GET",
            url: `/roles`,
            withCredentials: true
        });

        return {data:data, status:status===200}
    } catch (error) {
        console.error("Error fetching roles:", error);
        return {error:"Something went wrong"};
    }
}