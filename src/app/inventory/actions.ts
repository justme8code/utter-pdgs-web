'use server';
import {makeAuthRequest} from "@/app/actions";
import {Role, Supplier, User, UserResponse} from "@/app/data_types";
import {Ingredient, RawMaterial} from "@/app/inventory/RawMaterials";
import {NewSupplier} from "@/app/store/SupplierStore";





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


export async function addNewMaterial(rawMaterials:RawMaterial[]){
    const {data,status} = await makeAuthRequest<RawMaterial[],RawMaterial[]>({
        method: "POST",
        url: `/raw-materials`,
        data:rawMaterials
    })
    return {data: data,status: status === 201}
}

export async function getAllRawMaterials(){
    const {data, status} = await makeAuthRequest<null,RawMaterial[]>({
        method: "GET",
        url: `/raw-materials`,
    })
    return {data: data, status: status === 200}
}


export async function deleteMaterial(id:number){
    const {status} = await makeAuthRequest<number,null>({
        method: "DELETE",
        url: `/raw-materials/${id}`,
    })
    return {status: status === 204}
}

export async function getAllMaterialsWithIngredients(){
    const {data, status} = await makeAuthRequest<null,RawMaterial[]>({
        method: "GET",
        url: `/raw-materials`,
    })
    return {data: data, status: status === 200}
}

export async function  addIngredientsToRawMaterial(rawMaterialId:number,ingredients:Ingredient[]){
    const {data, status} = await makeAuthRequest<Ingredient[],null>({
        method: "POST",
        url: `/raw-materials/${rawMaterialId}/ingredients`,
        data:ingredients
    })
    return {data: data, status: status === 204}
}

export async function getAllIngredients(){
    const {data, status} = await makeAuthRequest<null,Ingredient[]>({
        method: "GET",
        url: `/ingredients`,
    })
    return {data: data, status: status === 200}
}


export async function addNewIngredient(ingredient:Ingredient[]){
    const {data,status} = await makeAuthRequest<Ingredient[],Ingredient[]>({
        method: "POST",
        url: `/ingredients`,
        data:ingredient
    })
    return {data: data,status: status === 200}
}

export async function updateIngredient(ingredient:Ingredient){
    const {data,status} = await makeAuthRequest<Ingredient,Ingredient>({
        method: "PUT",
        url: `/ingredients/${ingredient.id}`,
        data:ingredient
    })
    return {data: data,status: status === 200}
}

export async function getIngredientsByRawMaterialNames(rawMaterials: string[]) {
    const queryParams = rawMaterials.map(name => `rawMaterialNames=${encodeURIComponent(name)}`).join("&");

    const { data, status } = await makeAuthRequest<string[], Ingredient[]>({
        method: "GET",
        url: `/ingredients/search/by-raw-material-names?${queryParams}`,
    });

    return { data, status: status === 200 };
}

export  async  function createSuppliers(supplier:NewSupplier){
    const {data,status} = await makeAuthRequest<NewSupplier,Supplier>({
        method: "POST",
        url: `/suppliers`,
        data:supplier
    })
    return {data:data,status:status === 201}
}


export async function getAllSuppliers() {
    const {data, status} = await makeAuthRequest<null,Supplier[]>({
        method: "GET",
        url: `/suppliers/lists`,
    })
    return {data: data, status: status === 200}
}
