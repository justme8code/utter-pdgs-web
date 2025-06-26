import {Staff} from "@/app/types/staff";

export interface Evaluation {
    id?: number;
    productionId?: number;
    batchRange: string;
    manufacturedDate: string;
    expirationDate: string;
    staff?: Staff;
    evaluationType: EvaluationType;
    productionEvaluations: ProductionEvaluation[];
}

export type EvaluationType = "IN_PROCESS" | "POST_PROCESS" | null;
export type Taste = "ACCEPTABLE" | "UNACCEPTABLE" | null;


export interface ProductionEvaluation {
    id?: number;
    productMixId: number;
    taste: Taste;
    afterTaste: Taste;
    viscosity: Taste;
    comment: string;
    release: boolean;
}