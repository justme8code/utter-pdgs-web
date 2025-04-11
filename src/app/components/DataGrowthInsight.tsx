'use client';
import DataGrowthChart from "@/app/components/DataGrowthChart";

import React, {useEffect, useState} from "react";
import {DataGrowthDto, fetchDataGrowthInsight} from "@/app/actions/insights";

export const DataGrowthInsight = ()=>  {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const formatDate = (date:Date) => date.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(formatDate(oneWeekAgo));
    const [endDate, setEndDate] = useState(formatDate(now));

    const [data, setData] = useState<DataGrowthDto[]>([]);

    const handleDateChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (startDate && endDate) {
                const {data,status} = await fetchDataGrowthInsight(startDate,endDate);
                if (status) {
                    setData(data);
                }
            }
        };
        fetchData();
    },[endDate, startDate])


    return (
        <div className={"bg-gray-50 p-4 rounded-lg shadow-md"}>

            {/* Date Range Filters */}
            <div className={"flex gap-x-5 mb-5"}>
                <label>
                    Start Date:
                    <input
                        className={"border border-gray-300 rounded-xs px-2  outline-none focus:ring-2 focus:ring-slate-500 focus:border-none focus:outline-none"}
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        className={"border border-gray-300 rounded-xs px-2  outline-none focus:ring-2 focus:ring-slate-500 focus:border-none focus:outline-none"}
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange}
                    />
                </label>
            </div>
            <h2>Production and Product Mix Insights</h2>
            <DataGrowthChart data={data} startDate={startDate} endDate={endDate} />
        </div>
    );
};