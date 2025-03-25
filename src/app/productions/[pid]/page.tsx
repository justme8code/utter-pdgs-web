import { ProductionInfo } from "@/app/productions/ProductionInfo";
import { RawMaterialsToIngredients } from "@/app/productions/tables/RawMaterialsToIngredients";
import { Navbar } from "@/app/productions/Navbar";
import Sidebar from "@/app/components/SideBar";
import { fetchProductionWithDynamicData } from "@/app/productions/actions";
import { PopulateEditPurchaseTable } from "@/app/productions/tables/PopulateEditPurchaseTable";
import { RawMaterialsToIngredientsTable } from "@/app/productions/tables/RawMaterialsToIngredientsTable";

export default async function ProductionPage({ params }: { params: Promise<{ pid: number }> }) {
    const { pid } = await params;
    const { data, status } = await fetchProductionWithDynamicData(pid);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - fixed on the left side */}
            <div className="md:fixed md:top-0 md:left-0 md:w-64 md:h-full z-50">
                <Sidebar />
            </div>

            {/* Main content */}
            <main className="flex flex-col w-full md:ml-64 h-full ">
                <div className="flex-1 flex flex-col h-full p-2 gap-5">
                    <Navbar />
                    {!status ? (
                        <p>Could not find production...</p>
                    ) : (
                        <div className="space-y-10">
                            <ProductionInfo prod={data} />
                            <div className="space-y-10">
                                <PopulateEditPurchaseTable production={data} />
                                <RawMaterialsToIngredientsTable production={data} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
