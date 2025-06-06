
import { ProductionOverView } from "@/components/dashboard/ProductionOverView";
import InventoryDashboard from "@/components/dashboard/InventoryDashboard"; // Adjust path as needed

export const Dashboard = () => { // Or export default function DashboardPage() if it's a page
    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </header>

            <main>
                {/* Production Overview Section */}
                <div className="mb-8">
                    <ProductionOverView />
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
