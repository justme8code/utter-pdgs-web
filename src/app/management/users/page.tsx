'use client';
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {UsersList} from "@/app/components/user/UsersList";
import React from "react";

export default function UserManagement() {

    return (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
            <div className="space-y-10 w-full">
                <nav className="flex justify-between px-6 py-4  items-center mb-4 bg-white w-full p-2">
                    <h1 className="text-xl font-medium">User Management</h1>
                </nav>
                <UsersList/>
            </div>
        </ProtectedRoute>
    );
}