'use client';
import {useState, useEffect, useCallback} from "react";
import { myRequest } from "@/app/api/axios";
import useAuthStore from "@/app/store/useAuthStore";

export type Role = {
    id: number;
    userRole: string;
};

export const ManageRoles = ({ onChange }: { onChange: (roles: Role[]) => void }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const { auth } = useAuthStore();

    const fetchRoles = useCallback(async () => {
        if (!auth) return; // Ensure auth is available before making requests
        console.log("Fetching roles with auth:", auth);

        try {
            const { data, status } = await myRequest<null, Role[]>({
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${auth.jwtToken}`,
                },
                method: "GET",
                url: `/roles`,
                withCredentials: true
            });

            if (status === 200 && data) {
                setRoles(data);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }, [auth]);

    const toggleRoleSelection = (role: Role) => {
        setSelectedRoles((prevSelectedRoles) => {
            const isSelected = prevSelectedRoles.some((r) => r.id === role.id);
            const updatedRoles = isSelected
                ? prevSelectedRoles.filter((r) => r.id !== role.id)
                : [...prevSelectedRoles, role];

            onChange(updatedRoles); // Pass only the selected roles
            return updatedRoles;
        });
    };

    // Fetch roles only when auth is available
    useEffect(() => {
        if (auth) fetchRoles();
    }, [auth, fetchRoles]); // Runs when `auth` updates

    return (
        <>
            {auth && auth.user.roles.length > 0 && (
                <div>
                    <div className="mb-4">
                        <h3 className="font-bold mb-2">Select Roles:</h3>
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    onChange={() => toggleRoleSelection(role)}
                                />
                                {role.userRole}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

