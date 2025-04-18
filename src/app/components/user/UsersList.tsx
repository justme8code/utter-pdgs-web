import {Trash, Trash2, User2, UserPen} from "lucide-react";
import React, {useEffect, useState} from "react";
import useAuthStore from "@/app/store/useAuthStore";
import {CreateUserModal} from "@/app/components/user/CreateUserModal";
import {fetchUsers} from "@/app/actions/inventory";
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
        <div className={"w-full"}>

            <div className={"flex items-center w-full gap-10 mb-5"}>
                <h2 className="text-xl font-bold ">User Management</h2>
                <button onClick={() => {
                    setSelectedUser(undefined);
                    setIsOpen(true);
                }} className={"bg-gray-200  text-sm ring-1 ring-gray-300 flex items-center gap-2 p-1 rounded-sm "}>
                    <p>Create New User</p>
                </button>
            </div>
            {isOpen && <CreateUserModal user={selectedUser} isOpen={isOpen} onClose={() => {
                setSelectedUser(undefined);
                setIsOpen(false);
            }} />}
            <div className="max-w-4xl">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Full Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Roles</th>
                        <th className="border  border-gray-300 p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users && users.length>0 && users.map((user) => (
                        <tr key={user.id} className="border border-gray-50">
                            <td className="border border-gray-300 p-2">{user.fullName}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">
                                {user.roles && user.roles.map(role => role.userRole).join(", ")}
                            </td>
                            <td className="border border-gray-300 p-2">
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
                                    <Trash />
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