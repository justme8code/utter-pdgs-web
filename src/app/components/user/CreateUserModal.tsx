import {Modal} from "@/app/components/Modal";
import {TextField} from "@/app/components/TextField";
import {Button} from "@/app/components/Button";
import React, {useActionState, useEffect, useState} from "react";
import useAuthStore from "@/app/store/useAuthStore";
import {createUser, fetchRoles} from "@/app/actions/inventory";
import {Role, User} from "@/app/types";

interface CreateUserModalProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ user, isOpen, onClose }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const { auth } = useAuthStore();
    const isEdit = !!user;



    const [error, action, isPending] = useActionState(async (previousState: unknown, formData: FormData) => {
        const status = await createUser(previousState, formData, selectedRoles);
        if (status) {
            setSuccessMessage(isEdit ? "User updated successfully!" : "User created successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }, null);

    const toggleRoleSelection = (role: Role) => {
        setSelectedRoles((prevSelectedRoles) => {
            const isSelected = prevSelectedRoles.some((r) => r.id === role.id);
            return isSelected ? prevSelectedRoles.filter((r) => r.id !== role.id) : [...prevSelectedRoles, role];
        });
    };

    const handleFetchRoles = async () => {
        const data = await fetchRoles();
        if (data && data.data) {
            setRoles(data.data);
        }
    };

    useEffect(() => {
        if (user) {
            setSelectedRoles(user.roles ?? []);
        }
        handleFetchRoles();
    }, [user]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={"w-full max-w-md"}>
            <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>
            {successMessage && <p className="text-green-500 font-semibold">{successMessage}</p>}
            <form action={action} className="space-y-5 w-full">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : null}
                <TextField
                    name="fullName"
                    label="Full Name"
                    required
                    type="text"
                    placeholder="Enter Full Name"
                    defaultValue={user?.fullName ?? ""}
                />
                <TextField
                    name="email"
                    label="Email"
                    required
                    type="email"
                    placeholder="Enter Email"
                    defaultValue={user?.email ?? ""}
                />
                <TextField
                    name="companyRole"
                    label="Company Role"
                    required
                    type="text"
                    placeholder="Enter Company Role"
                    defaultValue={user?.staff?.companyRole ?? ""}
                />
                <TextField
                    name="password"
                    label="Password"
                    required
                    type="password"
                    placeholder="Enter Password"
                    defaultValue=""
                />
                {auth && auth.user.roles.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-2">Select Roles:</h3>
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center gap-2">
                                <input type="checkbox" onChange={() => toggleRoleSelection(role)} name="roles" />
                                {role.userRole}
                            </label>
                        ))}
                    </div>
                )}
                <Button
                    label={isPending ? "Processing..." : user ? "Update User" : "Add User"}
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={isPending}
                />
            </form>
        </Modal>
    );
};