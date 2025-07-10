import {Purchase} from "@/app/types/purchase";
import {Conversion} from "@/app/types/conversion";
import {Production} from "@/app/types/production";

export type ConversionBatch = {
    id: number;
    name: string;
    active: boolean;
    conversions: Conversion[];
};

export type ProductionDetailsFull = {
    production: Production;
    purchases: Purchase[];
    conversionsByBatch: ConversionBatch[];
};
