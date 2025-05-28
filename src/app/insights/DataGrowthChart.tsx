'use client';
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
import {DataGrowthDto} from "@/app/actions/insights";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DataGrowthChart = ({ data,startDate,endDate }:{data:DataGrowthDto[],startDate:string,endDate:string}) => {
    // Setup state for the start and end date




    // Filter data based on selected date range
    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return itemDate >= start && itemDate <= end;
    });

    // Prepare the chart data based on the filtered data
    const chartData = {
        labels: filteredData.map((item) => item.date),
        datasets: [
            {
                label: 'Productions',
                data: filteredData.map((item) => item.newProductions),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
            {
                label: 'Product Mixes',
                data: filteredData.map((item) => item.newProductMixes),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className={"flex"}>
            {/* Chart */}
            <div className={"w-full h-64 md:h-96 mb-4"} >
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default DataGrowthChart;
