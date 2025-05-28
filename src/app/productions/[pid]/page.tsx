import {fetchProductionFullData} from "@/app/actions/production";
import ProductionOverView from "@/app/productions/[pid]/ProductionOverView";
import {PurchaseTable} from "@/app/productions/component/PurchaseTable";
import {ConversionTable} from "@/app/productions/component/conversion/ConversionTable";
import {ProductMixProducts} from "@/app/productions/[pid]/ProductMixProducts";
import {FinishProduction} from "@/app/productions/[pid]/FinishProduction";

export default async function ProductionPage({ params }: { params: Promise<{ pid: number }> }) {
    const { pid } = await params;
    /*const { data, status } = await fetchProductionWithDynamicData(pid);*/
    const {data,status} = await fetchProductionFullData(pid);
    return (
         <div className={"w-full"}>
             {!data || !status?  <div className={"flex justify-center items-center h-screen"}>
                 <p>Could not fetch Production</p>
             </div> : (
                 <div>
                     <ProductionOverView data={data}/>
                     <div className={"flex flex-col space-y-10 p-6"}>
                         <PurchaseTable/>
                         <ConversionTable/>
                         <ProductMixProducts/>
                         <FinishProduction/>
                    </div>
                 </div>
                 )}
         </div>

    );
}
