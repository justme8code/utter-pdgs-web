import {ProductionOverView} from "@/components/dashboard/ProductionOverView";
import InventoryDashboard from "@/components/dashboard/InventoryDashboard";
import React from "react";
import {Navbar} from "@/components/layout/Navbar"; // Adjust path as needed

export const Dashboard = () => { // Or export default function DashboardPage() if it's a page
    return (
        <div className="min-h-screen  p-4 md:p-8 space-y-6">
            <Navbar title={"Dashboard"}/>

            <main>
                {/* Production Overview Section */}
                <div className="mb-8">
                    <ProductionOverView/>
                </div>
                <div>
                    <InventoryDashboard/>
                </div>
            </main>

            <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} @utterlyyum. All rights reserved.</p>
            </footer>
        </div>
    );
};
