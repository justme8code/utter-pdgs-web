'use server';
import {Evaluation, ProductionStore, Purchase} from "@/app/types";
import {makeAuthRequest} from "@/lib/session";


export async function createEvaluation(productionId: number, evaluation: Evaluation) {
    const {data, status, error} = await makeAuthRequest<Purchase, {
        productionStore: ProductionStore,
        purchase: Purchase
    }>({
        url: `/productions/${productionId}/evaluations`,
        method: "POST",
        data: evaluation
    });
    return {data: data, status: status === 201, error: error};
}


export async function getEvaluationsByProductions(productionId: number) {

    const {data, status, error} = await makeAuthRequest<null, Evaluation[]>({
        url: `/productions/${productionId}/evaluations`,
        method: "GET"
    });
    console.log(data);
    console.log(status);
    console.log(error);
    return {data: data, status: status === 200, error: error};
}

