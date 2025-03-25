"use client";

import { ProductionResponse } from "@/app/data_types";
import { useRouter } from "next/navigation";
import React from "react";

interface ProductionListProps {
    productions: ProductionResponse[];
    error: { state: boolean; message: string };
}

const statusColors = {
    RUNNING: "text-blue-400",
    COMPLETED: "text-green-400",
    STOPPED: "text-red-400",
};

export default function ProductionList({ productions, error }: ProductionListProps) {
    const router = useRouter();

    if (error.state) {
        return <p className="text-red-500 font-semibold">{error.message}</p>;
    }

    if (productions.length < 1) {
        return null;
    }

    return (
        <div className="bg-white shadow-xs rounded-xl">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">ID</th>
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">Production Number</th>
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">Name</th>
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">Start Date</th>
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">End Date</th>
                        <th className="py-3 px-5 border-r border-gray-300 text-left text-gray-600 font-bold">Managed by</th>
                        <th className="py-3 px-5 text-left text-gray-600 font-bold">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productions.map((production) => (
                        <tr
                            key={production.id}
                            className="border-b border-gray-300 last:border-b-0 hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => router.push(`/productions/${production.id}`)} // ✅ Redirects on row click
                        >
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.id}</td>
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.productionNumber}</td>
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.name}</td>
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.startDate}</td>
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.endDate}</td>
                            <td className="py-3 px-5 border-r border-gray-300 text-gray-700">
                                {production.staff.userFullName} ({production.staff.companyRole})
                            </td>
                            <td className="py-3 px-5 border-r border-gray-300">
                                <span className={`font-bold ${statusColors[production.status]}`}>{production.status}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
