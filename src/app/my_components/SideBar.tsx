'use client';
import React, {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {usePathname} from 'next/navigation';
import useAuthStore from "@/app/store/useAuthStore";
import {LogoutButton} from "@/app/my_components/LogoutButton";
import {ProductionTab} from "@/app/my_components/tree-tabs/ProductionTab";
import {OverViewTab} from "@/app/my_components/tree-tabs/OverViewTab";
import {ProductTab} from "@/app/my_components/tree-tabs/ProductsTab";
import {InventoryTab} from "@/app/my_components/tree-tabs/InventoryTab";
import {SuppliersTab} from "@/app/my_components/tree-tabs/SuppliersTab";
import {ProductTaste} from "@/app/my_components/tree-tabs/ProductTaste";
import {FeedbackTab} from "@/app/my_components/tree-tabs/FeedbackTab";

import Image from "next/image";

import {hasRole} from "@/app/utils/auth";
import {ManagementTab} from "@/app/my_components/tree-tabs/ManagementTab";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activePath, setActivePath] = useState<string>(""); // 👈 new line
    const pathname = usePathname();
    const { auth } = useAuthStore();

    const hideSidebarPaths = ['/login'];

    if (hideSidebarPaths.includes(pathname)) {
        return null;
    }

    return (
        <div className="flex z-20 max-w-56 h-screen overflow-y-auto shadow-xs">
            <button
                className="p-3 md:hidden fixed top-4 left-4 z-50 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`h-full`}>
                <div className={`max-w-52 h-full justify-between p-3 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:relative md:w-64`}>
                    <div className={"flex flex-col justify-between"}>
                        <nav className={""}>
                            <div className={"flex p-3 w-full"}>
                                <Image alt={"logo"} src={"/logo.png"} width={70} height={70}/>
                            </div>
                            {auth && (
                                <div className={"p-2"}>
                                    <h1 className="text-xl font-bold ">{auth.user.fullName}</h1>
                                    <h1 className="text-xs font-bold ">{auth.user.staffProfession}</h1>
                                </div>
                            )}

                            <ul className="space-y-3  h-[calc(80vh)] overflow-y-auto ">
                                <OverViewTab
                                    activePath={activePath}
                                    onActiveChange={setActivePath}
                                />

                                <ProductionTab
                                    activePath={activePath}
                                    onActiveChange={setActivePath}
                                />
                                <ProductTab activePath={activePath} onActiveChange={setActivePath} />

                                <InventoryTab activePath={activePath} onActiveChange={setActivePath}/>

                                <ProductTaste activePath={activePath} onActiveChange={setActivePath}/>

                                <SuppliersTab activePath={activePath} onActiveChange={setActivePath}/>
                                {
                                    auth?.user && hasRole({ userRoles: auth?.user?.roles?.map((role) => role.userRole),requiredRole:"ROLE_ADMIN"}) && (
                                        <ManagementTab activePath={activePath} onActiveChange={setActivePath}/>
                                    )
                                }
                                <FeedbackTab activePath={activePath} onActiveChange={setActivePath}/>
                            </ul>
                        </nav>
                    </div>
                    <LogoutButton/>
                </div>
            </div>
        </div>
    );
}

