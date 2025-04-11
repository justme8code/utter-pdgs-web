'use client';
import { useState, useEffect } from "react";
import { myRequest } from "@/app/api/axios";
import useAuthStore from "@/app/store/useAuthStore";

type UserDto2 = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    roles: RoleDto[];
};

type RoleDto = {
    id: number;
    userRole: string;
};

type CreateUserRequest = {
    id: number;
    fullName: string;
    staff: StaffDto;
    pwd: string;
    email: string;
    phone: string;
    roles: RoleDto[];
};

type StaffDto = {
    profession: string;
    companyRole: string;
};




export const AddNewUser = () => {

    const [newUser, setNewUser] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [companyRole, setCompanyRole] = useState("");
    const {auth} = useAuthStore();
    const [users, setUsers] = useState<UserDto2[]>([]);

    const [roles, setRoles] = useState<RoleDto[]>([]);

    const fetchRoles = async () => {
        try {
            const { data, status } = await myRequest<null, RoleDto[]>({
                method: "GET",
                url: `/roles`
            });

            console.log(data);
            if (status === 200 && data) {
                setRoles(data);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

// Fetch roles on component mount

    const toggleRoleSelection = (role: string) => {
        setSelectedRoles((prevRoles) =>
            prevRoles.includes(role)
                ? prevRoles.filter((r) => r !== role)
                : [...prevRoles, role]
        );
    };

    const getUsers = async () => {
        const { data, status } = await myRequest<null, UserDto2[]>({
            method: "GET",
            url: `/users`
        });
        if (status === 200 && data) {
            setUsers(data);
        }
    };

    const addUser = async () => {
        if (!newUser.trim() || selectedRoles.length === 0 || !companyRole.trim()) return;

        // Map selected role names to their corresponding role objects
        const assignedRoles = roles
            .filter(role => selectedRoles.includes(role.userRole))
            .map(role => ({ id: role.id, userRole: role.userRole }));

        const newUserRequest: CreateUserRequest = {
            id: 0, // The backend should assign the ID
            fullName: newUser,
            staff: {
                profession: "Unknown", // You can add an input field for this
                companyRole: companyRole
            },
            pwd: "password123", // This should be handled securely on the backend
            email: `${newUser.toLowerCase().replace(/\s/g, "")}@example.com`, // Placeholder
            phone: "000-000-0000", // Placeholder
            roles: assignedRoles
        };

        try {
            const { status, data } = await myRequest<CreateUserRequest, UserDto2>({
                method: "POST",
                url: `/users`,
                data: newUserRequest
            });

            if (status === 201 && data) {
                setUsers([...users, data]); // Use the actual returned user object
                setNewUser("");
                setSelectedRoles([]);
                setCompanyRole("");
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };


    useEffect(() => {
        fetchRoles();
    }, []);


    return (
        <>
            { auth && auth.user.roles[0]  && (
                <div>
                    <h2 className="text-xl font-bold mb-4">User Management</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newUser}
                            onChange={(e) => setNewUser(e.target.value)}
                            placeholder="Enter user full name"
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="font-bold mb-2">Select Roles:</h3>
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role.userRole)}
                                    onChange={() => toggleRoleSelection(role.userRole)}
                                />
                                {role.userRole}
                            </label>
                        ))}
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={companyRole}
                            onChange={(e) => setCompanyRole(e.target.value)}
                            placeholder="Enter company role (e.g., Product Manager)"
                            className="border p-2 rounded"
                        />
                    </div>
                    <button onClick={addUser} className="bg-green-500 text-white p-2 rounded">Add User</button>
                    <ul className="bg-white shadow rounded-lg p-4 mt-4">
                        {users.map((user) => (
                            <li key={user.id} className="p-2 border-b">
                                <strong>{user.fullName}</strong> - {user.email} - {user.phone}
                                <br />
                                <span className="text-gray-600">Roles: {user.roles.map(r => r.userRole).join(", ")}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};
