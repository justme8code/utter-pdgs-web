
import { Level1DataInsightSection } from "@/app/components/Level1DataInsightSection";
import { DataGrowthInsight } from "@/app/components/DataGrowthInsight";
import Sidebar from "@/app/components/SideBar";

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

                     {/* Stats Cards */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {stats.map((stat, i) => (
                             <div key={i} className="bg-white rounded-2xl shadow p-6">
                                 <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                 <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
                             </div>
                         ))}
                     </div>

                     {/* Insights Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <Level1DataInsightSection />
                         <DataGrowthInsight />

                         <div className="bg-white rounded-2xl shadow p-6 col-span-1 lg:col-span-1">
                             <h3 className="text-lg font-semibold mb-4">📅 Recent Activities</h3>
                             <ul className="space-y-3 text-sm">
                                 {activities.map((item, index) => (
                                     <li key={index} className="flex items-start justify-between">
                                         <span className="text-gray-600">{item.action}</span>
                                         <span className="text-gray-400">{item.date}</span>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     </div>
                 </main>
             </div>

         </div>
    );
}
