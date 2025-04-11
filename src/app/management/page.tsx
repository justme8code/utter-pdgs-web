'use client';
import Sidebar from "@/app/components/SideBar";

import {UsersList} from "@/app/inventory/UsersList";

export default function InventoryPage() {

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex w-full h-screen p-6 space-x-10">
                <UsersList/>
            </main>
        </div>
    );
}