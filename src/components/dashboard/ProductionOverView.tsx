'use client'; // This component needs to be a client component to use hooks

import { useEffect, useState } from "react";
import { Production, ProductionOverviewData } from "@/app/types";
import {fetchProductionOverview} from "@/api/dashboardActions"; // Adjust path as needed


// Helper component to display a single production item
const ProductionItem = ({ production }: { production: Production }) => {
    return (
        <li className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-lg font-semibold text-blue-600">{production.name}</h4>
            <p className="text-sm text-gray-600">
                Number: <span className="font-medium">{production.productionNumber || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-600">
                Dates: <span className="font-medium">{new Date(production.startDate).toLocaleDateString()} - {new Date(production.endDate).toLocaleDateString()}</span>
            </p>
            {production.staff && (
                <p className="text-sm text-gray-600">
                    Staff: <span className="font-medium">{production.staff.userFullName}</span>
                </p>
            )}
            <p className="text-sm text-gray-600">
                Status: <span className={`font-medium ${production.finalized ? 'text-green-500' : 'text-yellow-500'}`}>
                    {production.finalized ? 'Finalized' : 'In Progress'}
                </span>
            </p>
        </li>
    );
};

export const ProductionOverView = () => {
    const [overviewData, setOverviewData] = useState<ProductionOverviewData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data, status } = await fetchProductionOverview();
                if (status && data) {
                    setOverviewData(data);
                } else {
                    setError("Failed to fetch production overview data.");
                    console.error("API Error: Failed to fetch production overview, status indicates failure or data is null");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                    <div className="h-16 bg-gray-300 rounded"></div>
                    <div className="h-16 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">Error: {error}</div>;
    }

    if (!overviewData) {
        return <div className="p-6 bg-white rounded-lg shadow-md">No production overview data available.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Production Overview</h2>

            <div className="mb-8 p-4 bg-indigo-50 rounded-md">
                <p className="text-xl text-indigo-700">
                    Total Productions: <span className="font-semibold text-2xl">{overviewData.totalProductions}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Productions In Progress ({overviewData.productionsInProgress.length})</h3>
                    {overviewData.productionsInProgress.length > 0 ? (
                        <ul className="space-y-4">
                            {overviewData.productionsInProgress.map((production) => (
                                <ProductionItem key={production.id || production.productionNumber} production={production} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No productions currently in progress.</p>
                    )}
                </section>

                <section>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Recent Productions ({overviewData.recentProductions.length})</h3>
                    {overviewData.recentProductions.length > 0 ? (
                        <ul className="space-y-4">
                            {overviewData.recentProductions.map((production) => (
                                <ProductionItem key={production.id || production.productionNumber} production={production} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No recent productions to display.</p>
                    )}
                </section>
            </div>
        </div>
    );
};