'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import useAuthStore from "@/app/store/useAuthStore";
import {LogoutButton} from "@/app/components/LogoutButton";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const {auth} = useAuthStore();

    // Define the path where the sidebar should be hidden
    const hideSidebarPaths = ['/login']; // Add more paths as needed

    if (hideSidebarPaths.includes(pathname)) {
        return null; // Don't render the sidebar on this path
    }

    return (
        <div className="flex z-50">
            <button
                className="p-3 md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 w-64 justify-between h-screen bg-gray-900 text-white p-5  transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:relative md:w-64`}>
                <div className={"h-96"}>
                    {auth && (
                        <div className={"p-2"}>
                            <h1 className="text-xl font-bold ">{auth.user.fullName}</h1>
                            <h1 className="text-xs font-bold ">{auth.user.staffCompanyRole}</h1>
                        </div>
                    )}
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="block p-2 rounded hover:bg-gray-700">Home</Link>
                            </li>
                            <li>
                                <Link href="/productions" className="block p-2 rounded hover:bg-gray-700">Productions</Link>
                            </li>
                            <li>
                                <Link href="/inventory" className="block p-2 rounded hover:bg-gray-700">Inventory</Link>
                            </li>
                            <li>
                                <Link href="/p-mix" className="block p-2 rounded hover:bg-gray-700">Product Mix</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <LogoutButton/>
            </div>
        </div>
    );
}
