import {Trash2, UserPen} from "lucide-react";
import React, {useEffect, useState} from "react";
import useAuthStore from "@/app/store/useAuthStore";
import {CreateUserModal} from "@/app/inventory/CreateUserModal";
import {fetchUsers} from "@/app/inventory/actions";
import {UserResponse} from "@/app/data_types";




export const UsersList = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResponse| undefined>();
    const [isOpen,setIsOpen] = useState(false);
    const { auth } = useAuthStore();

    useEffect(() => {

            const res = async ()=>{
                const data = await fetchUsers();
                setUsers(data.data);
            }
            res();

    },[])

    return (
        <div className={"max-w-4xl"}>

            <div className={"flex items-center w-full justify-between p-3"}>
                <h2 className="text-xl font-bold ">User Management</h2>
                <button onClick={() => {
                    setSelectedUser(undefined);
                    setIsOpen(true);
                }} className={"bg-blue-500 p-1 rounded-sm text-white"}>
                    Create New User
                </button>
            </div>
            {isOpen && <CreateUserModal user={selectedUser} isOpen={isOpen} onClose={() => {
                setSelectedUser(undefined);
                setIsOpen(false);
            }} />}
            <div className="max-w-4xl">
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
                    {users && users.length>0 && users.map((user) => (
                        <tr key={user.id} className="border border-gray-50">
                            <td className="border border-gray-50 p-2">{user.fullName}</td>
                            <td className="border border-gray-50 p-2">{user.email}</td>
                            <td className="border border-gray-50 p-2">
                                {user.roles && user.roles.map(role => role.userRole).join(", ")}
                            </td>
                            <td className="border border-gray-50 p-2 flex justify-center">
                                <button
                                    className="bg-gray-200  hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full mr-2 hover:cursor-pointer "
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsOpen(true);
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
        </div>
    );
};