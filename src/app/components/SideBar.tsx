'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import useAuthStore from "@/app/store/useAuthStore";
import { LogoutButton } from "@/app/components/LogoutButton";
import {ProductionTab} from "@/app/components/tree-tabs/ProductionTab";
import {OverViewTab} from "@/app/components/tree-tabs/OverViewTab";
import {ProductTab} from "@/app/components/tree-tabs/ProductsTab";
import {InventoryTab} from "@/app/components/tree-tabs/InventoryTab";
import {SuppliersTab} from "@/app/components/tree-tabs/SuppliersTab";

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
        <div className="flex z-50 h-screen max-w-48">
            <button
                className="p-3 md:hidden fixed top-4 left-4 z-50 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`h-full`}>
                <div className={`fixed top-0 left-0 max-w-52 h-full justify-between p-5 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:relative md:w-64`}>
                    <div className={"h-96 space-y-5"}>
                        {auth && (
                            <div className={"p-2"}>
                                <h1 className="text-xl font-bold ">{auth.user.fullName}</h1>
                                <h1 className="text-xs font-bold ">{auth.user.staffProfession}</h1>
                            </div>
                        )}
                        <nav>
                            <ul className="space-y-3">
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

                                <SuppliersTab activePath={activePath} onActiveChange={setActivePath}/>
                            </ul>
                            <LogoutButton/>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

