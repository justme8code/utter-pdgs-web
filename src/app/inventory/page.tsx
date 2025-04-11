'use client';
import Sidebar from "@/app/components/SideBar";
import {RawMaterials} from "@/app/components/inventory/RawMaterials";
import {Ingredients} from "@/app/components/inventory/Ingredients";
import {SuppliersList} from "@/app/components/inventory/SuppliersList";

export default function InventoryPage() {


    return (
        <div className="flex">
            <Sidebar />
            <main className="flex gap-20 flex-col w-full h-screen p-6 space-x-10">
                <h1 className={"text-4xl font-bold"}>Inventory</h1>

               <div className={"flex gap-5"}>
                   <RawMaterials/>
                   <Ingredients/>
               </div>

                <SuppliersList/>
            </main>
        </div>
    );
}