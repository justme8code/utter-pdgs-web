'use client';

import Sidebar from "@/app/components/SideBar";
import PurchaseEntryTable from "@/app/new/PurchaseEntryTable";
import MaterialToIngredientTable from "@/app/new/MaterialToIngredientTable";

export default function NewPage( ) {

    return (
        <div className={"flex w-full"}>
            <Sidebar />
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 w-full">
                <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <div className="text-xl font-bold text-indigo-600">New</div>
                </nav>

                <main className="flex flex-col w-full flex-1 p-4 space-y-6">
                    <PurchaseEntryTable />
                    <MaterialToIngredientTable/>
                </main>
            </div>
        </div>
    );
}