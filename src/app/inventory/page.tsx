'use client';
import { useState } from "react";
import Sidebar from "@/app/components/SideBar";
import {InventoryList} from "@/app/inventory/InventoryList";
import {AddNewUser} from "@/app/inventory/AddNewUser";
import {ManageRoles} from "@/app/inventory/ManageRoles";
import { ManageUsers } from "./ManageUsers";
import {UsersList} from "@/app/inventory/UsersList";
import {RawMaterials} from "@/app/inventory/RawMaterials";

export default function InventoryPage() {


    return (
        <div className="flex">
            <Sidebar />
            <main className="flex w-full h-screen p-6 space-x-10">
                <UsersList/>
                <RawMaterials/>
            </main>
        </div>
    );
}