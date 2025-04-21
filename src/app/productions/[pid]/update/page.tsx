import Sidebar from "@/app/components/SideBar";
import {fetchProductionWithDynamicData} from "@/app/actions/production";
import {ProductionResponse} from "@/app/data_types";
import {ProductMixPage} from "@/app/components/production/productMix/ProductMixPage";
import {LoadSelectedProduction} from "@/app/productions/[pid]/update/LoadSelectedProduction";

const ProdInf = ({prod}: { prod: ProductionResponse }) => {
    return (
        <div className={"flex sticky top-0 items-center gap-x-2 ring-1 bg-gray-50 ring-gray-200 p-2 justify-between "}>

            <div className={"flex items-center gap-x-2 text-md font-bold"}>
                <h1>Update</h1>
                <h1 className={""}>{prod.productionNumber}</h1>
                <h1>|</h1>
                <h1 className={" "}>{prod.name}</h1>
            </div>
            <div className={"flex items-center gap-5"}>
                <div className={"flex gap-5"}>
                    <div className={"flex"}>
                        <h1 className={"text-sm"}>Start date : </h1>
                        <h1 className={"text-sm font-bold"}>{prod.startDate}</h1>
                    </div>

                    <div className={"flex"}>
                        <h1 className={"text-sm"}>End date : </h1>
                        <h1 className={"text-sm font-bold"}>{prod.endDate}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default async function UpdateProductionPage({params}: { params: Promise<{ pid: number }> }) {
    const {pid} = await params;
    const {data, status} = await fetchProductionWithDynamicData(pid);
    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex gap-20 flex-col w-full h-screen  space-x-10 bg-gray-50">
                <div className="flex-1 flex flex-col h-full p-2 gap-5">
                    <ProductMixPage/>
                    {!status ? (
                        <p>Could not find production...</p>
                    ) : (
                        <div className="space-y-10">
                            <LoadSelectedProduction data={data} />
                            <ProdInf prod={data}/>
                            <div className="space-y-10">

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
}
