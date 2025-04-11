import { Navbar } from "@/app/components/Navbar";
import { ProductionPagination } from "@/app/components/production/ProductionPagination";
import Sidebar from "@/app/components/SideBar";

export default async function ProductionPage({searchParams}: {
    searchParams: Promise<{ page?: string; size?: string }>
}) {
    const page = parseInt((await searchParams).page || "0", 10);
    const size = parseInt((await searchParams).size || "100", 10);

    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex flex-col w-full h-screen justify-center max-md:ml-0">
                <div className="flex-1 flex flex-col h-screen p-2 gap-5">
                    <Navbar/>
                    <div className="space-y-10">
                        <ProductionPagination page={page} size={size}/>
                    </div>
                </div>
            </main>
        </div>
    );
}
