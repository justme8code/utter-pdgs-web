
import { ProductionInfo } from "@/app/productions/ProductionInfo";

import { RawMaterialsToIngredients } from "@/app/productions/tables/RawMaterialsToIngredients";
import {Navbar} from "@/app/productions/Navbar";
import Sidebar from "@/app/components/SideBar";
import {fetchProductionWithDynamicData} from "@/app/productions/actions";
import {PopulateEditPurchaseTable} from "@/app/productions/tables/PopulateEditPurchaseTable";
import {RawMaterialsToIngredientsTable} from "@/app/productions/tables/RawMaterialsToIngredientsTable";

export default async function ProductionPage({params}:{params:Promise<{pid:number}>}) {
    const {pid}  = await params;
    const {data,status} = await fetchProductionWithDynamicData(pid);


    return (
         <div className={"flex"}>
             <Sidebar/>
             <main className="flex flex-col w-full h-screen justify-center max-md:ml-0">

                 <div className="flex-1 flex flex-col h-screen p-2 gap-5">
                     <Navbar/>
                     {!status ? (
                         <p>Could not find production...</p>
                     ):<div className={"space-y-10"}>
                         {<ProductionInfo  prod={data}/>}

                         <div className="space-y-10">
                              <PopulateEditPurchaseTable production={data} />
                              <RawMaterialsToIngredientsTable production={data}/>
                         </div>
                     </div>
                     }
                 </div>
             </main>
         </div>
    );
}