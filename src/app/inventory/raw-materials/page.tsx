'use client';
import Sidebar from "@/app/components/SideBar";
import {RawMaterials} from "@/app/components/inventory/RawMaterials";
import {Ingredients} from "@/app/components/inventory/Ingredients";
import {SuppliersList} from "@/app/components/inventory/SuppliersList";
import {CreateAProductButton} from "@/app/components/production/CreateAProductButton";

export default function RawMaterialInventoryPage() {


    return (
        <div className="flex">
            <Sidebar />
            <main className="flex gap-10 flex-col w-full h-screen space-x-10 bg-gray-50">

                <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center w-full">
                    <div className="text-xl font-bold ">
                        Inventory/Raw Materials
                    </div>

                </nav>

               <div className={"flex"}>
                   <RawMaterials/>
               </div>

               {/* <SuppliersList/>*/}
            </main>
        </div>
    );
}