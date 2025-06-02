import {Production} from "@/app/types/production";

export interface ProductionOverviewData {
     totalProductions: number;
     productionsInProgress: Production[];
     recentProductions: Production[];
}