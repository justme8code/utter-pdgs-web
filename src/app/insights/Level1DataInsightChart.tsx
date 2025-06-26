'use client';
import React from 'react';
import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {InsightDataType} from "@/api/insights";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Level1DataInsightChart = ({data}: { data: InsightDataType }) => {
    // Prepare the chart data based on the Level1DataInsightDto
    const chartData = {
        labels: ['Total Qty', 'Total Cost', 'Avg Cost', 'Total Lost'],
        datasets: [
            {
                label: 'Production Data',
                data: [
                    data.totalQtyOfRawMaterials,
                    data.totalCostOfPurchases,
                    data.avgCostOfPurchases,
                    data.totalProductionLost,
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    };

    // Top 3 purchased raw materials
    const top3List = data.top3PurchasedRawMaterials.map((item, index) => (
        <li key={index} className="mb-2">{item.name}</li>
        /*<li key={index} className="mb-2">{item.name} - {item.count} units</li>*/
    ));

    return (
        <div className="space-y-4">

            {/* Chart */}
            <div className="w-full h-64 md:h-96 mb-4">
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Production Insights',
                            font: {
                                size: 20
                            }
                        }
                    }
                }}/>
            </div>

            {/* Top 3 Purchased Raw Materials */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">Top 3 Purchased Raw Materials</h4>
                <ul>{top3List}</ul>
            </div>
        </div>
    );
};

export default Level1DataInsightChart;
