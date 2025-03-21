'use server';
import {makeAuthRequest} from "@/app/actions";
import {Role, User, UserResponse} from "@/app/data_types";





export async function createUser(previousState: unknown, formData: FormData,roles:Role[]) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyRole = formData.get("companyRole") as string;
    const professionRole = companyRole;
    const password = formData.get("password") as string;

    // If roles are empty, assign the default role
    if (!roles || roles.length === 0) {
        roles = [{userRole: "ROLE_USER",id:1}];
    }

    if (!email || !password) {
        return {error: "Email or password is required"};
    }
    const createUserRequest: User = {
        fullName,
        email,
        phone,
        pwd: password,
        staff: {
            id:0,
            companyRole,
            professionRole
        },
        roles: roles,
    };

    const {status} = await makeAuthRequest<User, null>({
        url: `/users`,
        method: "POST",
        data: createUserRequest,
    });

    return status === 201;
}


export async function fetchUsers() {
    const {data, status} = await makeAuthRequest<null, UserResponse[]>({
        method: "GET",
        url: `/users`
    });
    return {data: data, status: status === 200}
}


export async function fetchRoles() {
    const {data, status} = await makeAuthRequest<null, Role[]>({
        method: "GET",
        url: `/roles`
    });

    return {data: data, status: status === 200}
}




