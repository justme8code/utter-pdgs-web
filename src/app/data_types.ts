export type ProductionResponse = {
    createdAt: string,
    id: number,
    productionNumber: string,
    name: string,
    startDate: string,
    endDate: string,
    staff:{
        id: number,
        userId: number,
        userFullName: string,
        companyRole:string
    },
    status: "RUNNING" | "COMPLETED" | "PAUSED",
}

export interface ExtendedProductionResponse extends ProductionResponse {
    dynamicDataId: number,
    dynamicDataName: string,
    dynamicData:Record<string, never>
}


export type StaffResponse = {
    id:number,
    userId:string,
    userFullName:string,
    profession:string,
    companyRole:string
}

export type Production = {
    startDate: string,
    endDate: string,
    name: string,
    id?: number
}


export type User = {
    fullName?: string;
    email?: string;
    pwd?: string;
    phone?: string;
    roles?: Role[];
    staff?: Staff;
}

export type Role = {
    id: number;
    userRole: string;
};

export type Staff = {
    id?: number,
    companyRole?:string;
    professionRole?:string
};

export type Supplier = {
    id: number,
    fullName: string,
    address: string;
    phoneNumber: string;
    emailAddress: string;
}

export type Pageable<T> = {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
};


export interface IngredientUsage {
    // Define the properties of IngredientUsageDto here, for example:
    ingredientId: number;
    litresUsed: number;
}

export interface ProductMix{
    id: number;
    productionId: number;
    productId: number;
    ingredientUsages: IngredientUsage[];
    totalLitersUsed: number;
    qty: number;
    brixOnDiluent: number;
    initialBrix: number;
    finalBrix: number;
    initialPH: number;
    finalPH: number;
}


// Response Data Types
export type UserResponse = Omit<User, "pwd"> & { id: number };


