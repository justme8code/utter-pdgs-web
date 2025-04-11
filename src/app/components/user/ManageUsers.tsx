'use client';
import React, {useState, useEffect, useCallback, useActionState} from "react";
import { myRequest } from "@/app/api/axios";
import useAuthStore from "@/app/store/useAuthStore";
import {Modal} from "@/app/components/Modal";
import {Trash2, UserPen} from "lucide-react";
import {Button} from "@/app/components/Button";
import { ManageRoles } from "./ManageRoles";
import {TextField} from "@/app/components/TextField";

type RoleDto = {
    id: number;
    userRole: string;
};

type UserDto = {
    id: number;
    fullName: string;
    email: string;
    roles: RoleDto[];
};

type FormInfo = {
    fullName?: string;
    email?: string;
    pwd?: string;
    phone?: string;
    roles?: {id: number; name: string}[];
    staff?: {companyRole:string,professionRole:string};
}

export const ManageUsers = () => {
    const { auth } = useAuthStore();


    useEffect(() => {


    }, [auth]);



    return (
        <div>

        </div>
    );
};