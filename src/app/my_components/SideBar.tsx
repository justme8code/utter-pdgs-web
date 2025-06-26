// app/my_components/SideBar.tsx
'use client';
import React, {useEffect, useState} from 'react';
import {Menu, UserCircle as UserIcon, X} from 'lucide-react'; // Added more icons
import {usePathname} from 'next/navigation';
import useAuthStore from "@/app/store/useAuthStore";
import {LogoutButton} from "./LogoutButton"; // Assuming this is already styled or a Shadcn button
import {ProductionTab} from "./tree-tabs/ProductionTab";

import {ProductTab} from "./tree-tabs/ProductsTab";
import {InventoryTab} from "./tree-tabs/InventoryTab";
import {SuppliersTab} from "./tree-tabs/SuppliersTab";
import {EvaluationTab} from "./tree-tabs/EvaluationTab";
import {FeedbackTab} from "./tree-tabs/FeedbackTab";
import Image from "next/image";
import {hasRole} from "@/app/utils/auth";
import {ManagementTab} from "./tree-tabs/ManagementTab";
import Link from "next/link"; // For logo link
import {cn} from '@/lib/utils';
import {OverViewTab} from "@/app/my_components/tree-tabs/OverViewTab"; // Shadcn utility for conditional classes

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
    const [activePath, setActivePath] = useState<string>("");
    const pathname = usePathname();
    const {auth} = useAuthStore();

    // Update activePath based on current pathname
    // This helps set the initial active state correctly on page load/navigation
    useEffect(() => {
        // Extract the first segment of the pathname to match top-level TreeNav paths
        const currentTopLevelPath = pathname.split('/')[1] || (pathname === '/' ? '/' : ''); // Handle root path

        setActivePath(currentTopLevelPath === '' && pathname === '/' ? '/' : currentTopLevelPath);
    }, [pathname]);


    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <button
                className={cn(
                    "p-2 md:hidden fixed top-4 left-4 z-[60] rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                    // Add a background if you want it to stand out more on complex backgrounds
                    // "bg-background/80 backdrop-blur-sm border"
                )}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col justify-between">
                    {/* Top Section: Logo & User Info */}
                    <div className="px-4 py-5">
                        <Link href="/"
                              className="flex items-center gap-2 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                            <Image alt="Company Logo" src="/logo.png" width={40} height={40} className="rounded-md"/>
                            <span
                                className="text-xl font-semibold tracking-tight text-foreground">UtterlyYum</span> {/* Replace YourApp */}
                        </Link>

                        {auth && (
                            <div className="mb-6 p-3 rounded-md bg-muted/50 border">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-8 w-8 text-muted-foreground rounded-full bg-primary/10 p-1"/>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground truncate">{auth.user.fullName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{auth.user.staffProfession}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav
                        className="flex-grow px-2 space-y-1 overflow-y-auto custom-scrollbar pb-4"> {/* Added custom-scrollbar */}
                        {/* Using a simpler approach for activePath based on top-level pathname */}
                        <OverViewTab activePath={activePath} onActiveChange={setActivePath}/>
                        <ProductionTab activePath={activePath} onActiveChange={setActivePath}/>
                        <EvaluationTab activePath={activePath} onActiveChange={setActivePath}/>
                        <ProductTab activePath={activePath} onActiveChange={setActivePath}/>
                        <InventoryTab activePath={activePath} onActiveChange={setActivePath}/>
                        <SuppliersTab activePath={activePath} onActiveChange={setActivePath}/>
                        {auth?.user && hasRole({
                            userRoles: auth?.user?.roles?.map((role) => role.userRole),
                            requiredRole: "ROLE_ADMIN"
                        }) && (
                            <ManagementTab activePath={activePath} onActiveChange={setActivePath}/>
                        )}
                        <FeedbackTab activePath={activePath} onActiveChange={setActivePath}/>
                    </nav>

                    {/* Bottom Section: Logout */}
                    <div className="mt-auto p-4 border-t">
                        {/* Ensure LogoutButton is styled appropriately or replace */}
                        {/* Example: <Button variant="ghost" className="w-full justify-start"><LogOut className="mr-2 h-4 w-4" /> Logout</Button> */}
                        <LogoutButton/>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile to close sidebar on click */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}