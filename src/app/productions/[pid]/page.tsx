import { ProductionInfo } from "@/app/components/production/ProductionInfo";
import Sidebar from "@/app/components/SideBar";
import { fetchProductionWithDynamicData } from "@/app/actions/production";
import { PopulateEditPurchaseTable } from "@/app/productions/tables/PopulateEditPurchaseTable";
import { RawMaterialsToIngredientsTable } from "@/app/productions/tables/RawMaterialsToIngredientsTable";
import {ProductMix} from "@/app/components/production/ProductMix";
import {Button} from "@/app/components/Button";
import Link from "next/link";

export default async function ProductionPage({ params }: { params: Promise<{ pid: number }> }) {
    const { pid } = await params;
    const { data, status } = await fetchProductionWithDynamicData(pid);
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex gap-20 flex-col w-full h-screen  space-x-10">
                <div className="flex-1 flex flex-col h-full p-2 gap-5">
                    {!status ? (
                        <p>Could not find production...</p>
                    ) : (
                        <div className="space-y-10">
                            <ProductionInfo prod={data} />
                            <div className="space-y-10">
                                <PopulateEditPurchaseTable production={data} edit={false} />
                                <RawMaterialsToIngredientsTable production={data} edit={false}/>
                            </div>
                        </div>
                    )}
                    <div className={"flex justify-end p-4"}>
                         <Button label={"Update production"} href={`/productions/${pid}/update`}/>
                    </div>
                </div>
            </main>
        </div>

    );
}
