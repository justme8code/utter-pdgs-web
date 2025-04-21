
import { Level1DataInsightSection } from "@/app/insights/Level1DataInsightSection";
import { DataGrowthInsight } from "@/app/insights/DataGrowthInsight";
import Sidebar from "@/app/components/SideBar";
import {ProductMixPage} from "@/app/components/production/productMix/ProductMixPage";

export default function Home() {
    const stats = [
        { title: 'Total Productions', value: 145 },
        { title: 'Active Product Mixes', value: 27 },
        { title: 'Pending Approvals', value: 5 },
    ];

    const activities = [
        { date: '2025-04-11', action: 'Started Production Batch #0043' },
        { date: '2025-04-10', action: 'New Product Mix Created' },
        { date: '2025-04-09', action: 'Production Review Completed' },
    ];

    return (
         <div className={"flex w-full"}>
             <Sidebar/>
             <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 w-full">
                 <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center">
                     <div className="text-xl font-bold text-indigo-600">
                         📊 PDGS Insights
                     </div>

                 </nav>

                 <main className="flex flex-col w-full flex-1 p-4 space-y-6">
                     <h1 className="text-3xl font-bold">Production Insights Dashboard</h1>

                     <ProductMixPage/>
                 </main>
             </div>

         </div>
    );
}
