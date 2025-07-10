"use client";

import ProductionOverView from "./ProductionOverView"; // Assuming this is already styled
import {PurchaseTable} from "@/app/(main)/productions/prod_components/PurchaseTable"; // Adjusted path
import {ConversionTable} from "@/app/(main)/productions/prod_components/conversion/ConversionTable"; // Adjusted path
import {ProductMixProducts} from "./ProductMixProducts";
import {FinishProduction} from "./FinishProduction";
import {ProductionDetailsFull} from "@/app/types/new";


export default function ProductionPageClient({productionData}: { productionData: ProductionDetailsFull }) {
    return (
        <div className="container mx-auto py-6  space-y-8">
            {/* Overview Section - Assuming this is already a well-styled Card or prod_components */}
            <ProductionOverView data={productionData}/> {/* Adjust if 'data' prop expects a different structure */}

            {/* Main Content Sections */}
            <div className="space-y-10">
                {/* Each section below will be wrapped in a Card or styled div */}
                <PurchaseTable/>
                <ConversionTable/>
                <ProductMixProducts/>
                {/* FinishProduction is positioned absolutely, so it doesn't need a card wrapper here */}
            </div>
            <FinishProduction/>
        </div>
    );
}