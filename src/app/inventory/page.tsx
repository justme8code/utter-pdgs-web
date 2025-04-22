'use client';
import Sidebar from "@/app/components/SideBar";
import {RawMaterials} from "@/app/components/inventory/RawMaterials";
import {Ingredients} from "@/app/components/inventory/Ingredients";
import {SuppliersList} from "@/app/components/inventory/SuppliersList";

export default function InventoryPage() {


    return (
        <div>
            <h1 className={"text-4xl font-bold"}>Inventory</h1>

            <div className={"flex gap-5"}>
                <RawMaterials/>
                <Ingredients/>
            </div>

            <SuppliersList/>
        </div>
    );
}