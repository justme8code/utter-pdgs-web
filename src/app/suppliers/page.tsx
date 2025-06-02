'use client';
import {SuppliersList} from "@/app/components/inventory/SuppliersList";

export default function SuppliersPage() {
    return (
        <div>
            <nav className="bg-white shadow-xs px-6 py-4 flex justify-between items-center w-full">
                <div className="text-2xl font-bold ">
                    Suppliers
                </div>

            </nav>
            <div className={"flex"}>
                <SuppliersList/>
            </div>
        </div>
    );
}