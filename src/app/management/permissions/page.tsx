'use client';
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React from "react";

export default function PermissionsManagement() {
    return (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Permissions</h1>
                    <p className="text-lg text-gray-600">Permission feature coming soon.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}