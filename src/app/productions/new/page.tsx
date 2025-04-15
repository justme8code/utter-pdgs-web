
import { Level1DataInsightSection } from "@/app/insights/Level1DataInsightSection";
import { DataGrowthInsight } from "@/app/insights/DataGrowthInsight";
import Sidebar from "@/app/components/SideBar";
import {CreateAProductionButton} from "@/app/components/production/CreateAProductionButton";
import React from "react";

export default function NewProductionPage() {

    return (
         <div className={"flex w-full"}>
             <Sidebar/>
             <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 w-full">
                 <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center">
                     <h1 className="text-2xl font-bold">Create A New Production</h1>

                 </nav>

                 <main className="flex flex-col w-full flex-1 p-4 space-y-6">

                     <div className="flex flex-col w-full items-center justify-center p-8 ">
                         <CreateAProductionButton />
                         <p className="text-gray-500 mt-10">Create a production by clicking the button above!</p>
                     </div>
                 </main>
             </div>

         </div>
    );
}
