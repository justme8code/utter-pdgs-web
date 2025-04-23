'use client';
import {UsersList} from "@/app/components/user/UsersList";

export default function InventoryPage() {

    return (
        <div className="flex">
            <main className="flex w-full h-screen p-6 space-x-10">
                <UsersList/>
            </main>
        </div>
    );
}