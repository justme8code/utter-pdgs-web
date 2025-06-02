'use server';

import {makeAuthRequest} from "@/app/actions/main";
import {ProductionOverviewData} from "@/app/types";

export async function fetchProductionOverview(){
    const {data,status} = await makeAuthRequest<null,ProductionOverviewData>({
        url: `/dashboard/production-overview`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}