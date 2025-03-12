'use client';
import { useState } from "react";
import { ProductionInfo } from "@/app/productions/ProductionInfo";
import { PopulateEditPurchases } from "@/app/productions/tables/PopulateEditPurchases";
import { RawMaterialsToIngredients } from "@/app/productions/tables/RawMaterialsToIngredients";
import {Navbar} from "@/app/productions/Navbar";
import {ProductionPagination} from "@/app/productions/ProductionPagination";
import FunctionalErrorBoundary from "@/app/components/FunctionalErrorBoundary";
import Sidebar from "@/app/components/SideBar";

export default function ProductionPage() {

    const [selectedProductionId, setSelectedProductionId] = useState<number | null>(null);

    const handleSelectProduction = (id: number) => {
        setSelectedProductionId(id);
    };

    return (
         <div className={"flex"}>
             <Sidebar/>
             <main className="flex flex-col w-full h-screen justify-center max-md:ml-0">

                 <div className="flex-1 flex flex-col h-screen p-2 gap-5">
                     <Navbar/>

                     {selectedProductionId && <ProductionInfo />}

                     <div className="space-y-10">
                         {/*<PopulateEditPurchases />
                    <RawMaterialsToIngredients />*/}

                         <FunctionalErrorBoundary message="Oops! Something went wrong.">
                             <ProductionPagination/>
                         </FunctionalErrorBoundary>

                     </div>
                 </div>
             </main>
         </div>
    );
}