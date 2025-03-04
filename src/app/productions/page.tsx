'use client';
import Sidebar from "@/app/components/SideBar";
import { ProductionInfo } from "@/app/productions/ProductionInfo";
import { useState } from "react";
import {PopulateEditPurchases} from "@/app/productions/tables/PopulateEditPurchases";
import {RawMaterialsToIngredients} from "@/app/productions/tables/RawMaterialsToIngredients";

export default function ProductionPage() {
    const [productions, setProductions] = useState([
        { id: 1, product: "Shirt", quantity: 500, date: "2025-03-03" },
        { id: 2, product: "Jeans", quantity: 300, date: "2025-03-02" },
        { id: 3, product: "Jacket", quantity: 200, date: "2025-03-01" },
    ]);

    return (
        <main className="flex w-full ">

            <div className="flex-1 flex flex-col h-screen p-2 gap-5">
                {/* Show last production */}
                <ProductionInfo />

                {/*Add tables*/}
                <div className={"space-y-10"}>
                    <PopulateEditPurchases/>

                    <RawMaterialsToIngredients/>
                </div>

            </div>
        </main>
    );
}
