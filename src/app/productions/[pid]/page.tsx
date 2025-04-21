import Sidebar from "@/app/components/SideBar";
import {fetchProductionEntries} from "@/app/actions/production";
import {Tables} from "@/app/productions/[pid]/Tables";



export default async function ProductionPage({ params }: { params: Promise<{ pid: number }> }) {
    const { pid } = await params;
    /*const { data, status } = await fetchProductionWithDynamicData(pid);*/
    const {data,status} = await fetchProductionEntries(pid);
    return (
        <div className="flex">
            <Sidebar />
            {!data && !status? <p></p> : (<Tables sampleProduction={data} />)}
           {/* <main className="flex gap-20 flex-col w-full h-screen  space-x-10">
                <div className="flex-1 flex flex-col h-full p-2 gap-5">
                    {!status ? (
                        <p>Could not find production...</p>
                    ) : (
                        <div className="space-y-10">
                            <ProductionInfo prod={data} />
                            <div className="space-y-10">

                            </div>
                        </div>
                    )}
                    <div className={"flex justify-end p-4"}>
                         <Button label={"Update production"} href={`/productions/${pid}/update`}/>
                    </div>
                </div>
            </main>*/}
        </div>

    );
}
