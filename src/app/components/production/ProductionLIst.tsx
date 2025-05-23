"use client";

import { useRouter } from "next/navigation";
import React from "react";
import {SampleProduction} from "@/app/new/play-with-data";

interface ProductionListProps {
    productions: SampleProduction[];
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
                    {productions.length > 0 ? (
                        productions.map((production) => (
                            <tr
                                key={production.id}
                                className="border-b border-gray-300 last:border-b-0 hover:bg-gray-100 transition cursor-pointer"
                                onClick={() => router.push(`/productions/${production.id}`)}
                            >
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.id}</td>
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.productionNumber}</td>
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.name}</td>
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.startDate}</td>
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">{production.endDate}</td>
                                <td className="py-3 px-5 border-r border-gray-300 text-gray-700">
                                    {
                                        production.staff && (
                                            <div>
                                                {production.staff.userFullName} ({production.staff.companyRole})
                                            </div>
                                        )
                                    }
                                </td>
                                <td className="py-3 px-5 border-r border-gray-300">
                                    {
                                        production.status && (
                                            <div className={`font-bold ${statusColors[production.status]}`}>
                                                {production.status}
                                            </div>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="py-4 px-5 text-center text-gray-500">
                                No productions available.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
