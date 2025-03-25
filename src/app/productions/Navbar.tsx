'use client';
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();

    // Define paths where the navbar should be hidden
    const hideNavbarPaths = ["/login"]; // Add more paths as needed

    if (hideNavbarPaths.includes(pathname)) {
        return null; // Don't render the navbar on this path
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">

        </div>
    );
};
