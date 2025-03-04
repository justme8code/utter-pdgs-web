'use client';
import { useState } from "react";
import { ProductionInfo } from "@/app/productions/ProductionInfo";
import { PopulateEditPurchases } from "@/app/productions/tables/PopulateEditPurchases";
import { RawMaterialsToIngredients } from "@/app/productions/tables/RawMaterialsToIngredients";
import {Navbar} from "@/app/productions/Navbar";

export default function ProductionPage() {
    const [productions, setProductions] = useState([
        { id: 1, product: "Shirt", quantity: 500, date: "2025-03-03" },
        { id: 2, product: "Jeans", quantity: 300, date: "2025-03-02" },
        { id: 3, product: "Jacket", quantity: 200, date: "2025-03-01" },
    ]);
    const [selectedProductionId, setSelectedProductionId] = useState<number | null>(null);

    const handleSelectProduction = (id: number) => {
        setSelectedProductionId(id);
    };

    return (
        <main className="flex w-full h-screen">

            <div className="flex-1 flex flex-col h-screen p-2 gap-5">
                <Navbar
                    productions={productions}
                    onSelectProduction={handleSelectProduction}
                />

                {selectedProductionId && <ProductionInfo />}

                <div className="space-y-10">
                    <PopulateEditPurchases />
                    <RawMaterialsToIngredients />
                </div>
            </div>
        </main>
    );
}