import {Trash2, UserPen} from "lucide-react";
import React, {useState} from "react";
import useAuthStore from "@/app/store/useAuthStore";
import {CreateUserModal, UserDto} from "@/app/inventory/CreateUserModal";




export const UsersList = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto| undefined>();
    const { auth } = useAuthStore();



    return (
        <>


            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <CreateUserModal user={selectedUser} />
            <div className="max-w-2xl">
                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-100 p-2">Full Name</th>
                        <th className="border border-gray-100 p-2">Email</th>
                        <th className="border border-gray-100 p-2">Roles</th>
                        <th className="border  border-gray-100 p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border border-gray-50">
                            <td className="border border-gray-50 p-2">{user.fullName}</td>
                            <td className="border border-gray-50 p-2">{user.email}</td>
                            <td className="border border-gray-50 p-2">
                                {user.roles.map(role => role.userRole).join(", ")}
                            </td>
                            <td className="border border-gray-50 p-2 flex justify-center">
                                <button
                                    className="bg-gray-200  hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full mr-2 hover:cursor-pointer "
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setOpen(true);
                                    }}
                                >
                                    <UserPen />
                                </button>
                                <button
                                    className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full  hover:cursor-pointer "
                                    onClick={() => {}}
                                >
                                    <Trash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};