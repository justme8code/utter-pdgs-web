import {Modal} from "@/app/components/Modal";
import {TextField} from "@/app/components/TextField";
import {ManageRoles} from "@/app/inventory/ManageRoles";
import {Button} from "@/app/components/Button";
import React, {useActionState, useState} from "react";

export type UserDto = {
    id: number;
    fullName: string;
    email: string;
    roles: Role[];
};

export type Role = {
    id: number;
    userRole: string;
};


type FormInfo = {
    fullName?: string;
    email?: string;
    pwd?: string;
    phone?: string;
    roles?: {id: number; userRole: string}[];
    staff?: {companyRole:string,professionRole:string};
}



export const CreateUserModal = ({user}:{user?:UserDto}) => {
    const [info,setInfo] = useState<FormInfo>({});
    const [open,setOpen] = useState<boolean>(false);
    const [error, action, isPending] = useActionState(async (previousState, formData) => {
    }, null);

    return (
        <>


            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setOpen(true)}
            >Add New User</button>

                <Modal isOpen={open} onClose={() => setOpen(false)} >
                    <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>
                    <form action={action} className={"space-y-5"}>
                        <TextField
                            value={info.fullName??""}
                            label={"Full name"}
                            onChange={(value) =>  setInfo({...info, fullName: value})}
                            props={{ name: "full name", required: true, type: "text", placeholder: "Enter Full name" }}
                        />
                        <TextField
                            value={info.email??""}
                            label={"Email"}
                            onChange={(value) => setInfo({...info, email: value})}
                            props={{ name: "email", required: true, type: "email", placeholder: "Enter email" }}
                        />
                        <TextField
                            value={info.staff?.companyRole??""}
                            label={"Company Role"}
                            onChange={(value) => setInfo({...info, staff:{...info.staff, companyRole: value, professionRole:value}})}
                            props={{ name: "companyRole", required: true, type: "text", placeholder: "Enter company role" }}
                        />

                        <TextField
                            value={info.pwd??""}
                            label={"Password"}
                            onChange={(value) => setInfo({...info, pwd: value})}
                            props={{ name: "password", required: true, type: "password", placeholder: "Enter  password" }}
                        />
                        <ManageRoles onChange={roles => setInfo({...info, roles:roles})} />
                        <Button label={user ? "Update User" : "Add User"} type={"submit"}
                                className={"bg-green-500 text-white px-4 py-2 rounded"}/>
                    </form>
                      <div>
                          {info.roles?.map((item:Role) => item.userRole)}
                      </div>
                </Modal>
            </>
    );
};