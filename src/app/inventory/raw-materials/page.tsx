'use client';
import {RawMaterials} from "@/app/my_components/inventory/RawMaterials";

export default function RawMaterialInventoryPage() {

    return (
        <div>
            <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center w-full">
                <div className="text-2xl font-bold ">
                    Raw Materials
                </div>

            </nav>

            <div className={"flex p-4"}>
                <RawMaterials/>
            </div>

        </div>
    );
}