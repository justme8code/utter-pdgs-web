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
    status: "RUNNING" | "COMPLETED" | "STOPPED"
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
    status: "RUNNING" | "COMPLETED" | "STOPPED"
}