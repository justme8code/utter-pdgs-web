// app/your-path/UserManagement.tsx (or the page file, e.g., app/management/users/page.tsx)
'use client';
import ProtectedRoute from "@/app/my_components/ProtectedRoute"; // Assuming correct path
import {UsersList} from "@/app/my_components/user/UsersList"; // Assuming correct path
import React from "react";

export default function UserManagementPage() { // Renamed to avoid conflict if it's a page file
    return (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
            <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
                {/* This nav can be part of UsersList or a separate header component if used on multiple management pages */}
                {/* For simplicity, if it's just for this page, it's fine here, but often part of the main content component */}
                {/* <div className="flex justify-between items-center p-4 bg-card border rounded-lg shadow-sm mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-card-foreground flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-primary" />
                        User Management
                    </h1>
                    {/* Actions like global search or filters could go here */}
                {/* </div> */}
                <UsersList/>
            </div>
        </ProtectedRoute>
    );
}