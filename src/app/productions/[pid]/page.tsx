import {fetchProductionEntries} from "@/app/actions/production";
import {Tables} from "@/app/productions/[pid]/Tables";
import {ProductionInfo} from "@/app/components/production/ProductionInfo";
import {ProductMixPage} from "@/app/components/production/productMix/ProductMixPage";

export default async function ProductionPage({ params }: { params: Promise<{ pid: number }> }) {
    const { pid } = await params;
    /*const { data, status } = await fetchProductionWithDynamicData(pid);*/
    const {data,status} = await fetchProductionEntries(pid);
    return (
         <>
             {!data && !status? <p></p> : (
                 <div className="w-full bg-gray-50">
                     {/* Wrap all production-related components in WithRole */}
                         <ProductionInfo prod={data} />
                         <div className="flex flex-col justify-center items-center">
                             <Tables sampleProduction={data} />
                         </div>
                         <ProductMixPage />
                 </div>)}
         </>

    );
}
