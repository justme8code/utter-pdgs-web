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
    id: number
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


// Response Data Types
export type UserResponse = Omit<User, "pwd"> & { id: number };

