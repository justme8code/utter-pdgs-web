'use client';
import React, { useCallback, useEffect, useState } from "react";

import { TextField } from "@/app/components/TextField";
import Loading from "@/app/loading";

export default function ProductMixPage() {
   /* const [data, setData] = useState<ProductMix[]>([]);
    const [pagination, setPagination] = useState({ page: 0, size: 100 });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // 🔍 For filter chips
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [filterType, setFilterType] = useState<"productName" | "productionName">("productName");

    const handleFetchProductMixes = useCallback(async (page: number, size: number, query: string = "") => {
        setLoading(true);
        try {
            const { data: responseData, status } = await fetchProductMixes(page, size, query);
            if (status) {
                setData(responseData?.content || []);
                setTotalPages(responseData?.totalPages || 0);
            } else {
                setData([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching product mixes:", error);
            setData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetchProductMixes(pagination.page, pagination.size, searchQuery);
    }, [handleFetchProductMixes, pagination.page, pagination.size, searchQuery]);

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setPagination({ page: 0, size: pagination.size });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFetchProductMixes(pagination.page, pagination.size, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, pagination.page, pagination.size, handleFetchProductMixes]);


    const uniqueFilterValues = Array.from(
        new Set(data.map(item => item[filterType]).filter(Boolean))
    );

    const filteredData = activeFilter === "All"
        ? data
        : data.filter(item => item[filterType] === activeFilter);

    const ProductMixCard = ({ mix }: { mix: ProductMix }) => (
        <div className="bg-white p-4 rounded-sm shadow-xs hover:shadow-md transition duration-200 w-full sm:w-[48%] md:w-[32%]">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{mix.productName}</h2>
                <p className="text-sm text-gray-500 mb-2">
                    Production ID: <span className="font-medium">{mix.productionName}</span>
                </p>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Total Liters Used:</strong> {mix.totalLitersUsed?.toFixed(2) || 'N/A'}</p>
                <p><strong>Initial Brix:</strong> {mix.initialBrix?.toFixed(2) || 'N/A'}</p>
                <p><strong>Final Brix:</strong> {mix.finalBrix?.toFixed(2) || 'N/A'}</p>
                <p><strong>Initial PH:</strong> {mix.initialPH?.toFixed(2) || 'N/A'}</p>
                <p><strong>Final PH:</strong> {mix.finalPH?.toFixed(2) || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <div className={"w-full"}>
            {/!* Search Bar *!/}
            <nav className="flex mb-4 bg-white shadow-xs p-4 justify-between w-full ">
                <div>
                    <h1 className="text-xl font-medium">Production Mixes</h1>
                </div>

                 <div>
                     <TextField
                         value={searchQuery}
                         onChange={(e) => handleSearchChange(e)}
                         props={{
                             className: "bg-gray-300 p-1 px-4 outline-none border-none rounded-sm",
                             placeholder: "Search production mixes"
                         }}
                         label=""
                     />
                 </div>
            </nav>

            {/!* Filter Chips *!/}
            <div className="flex flex-wrap gap-5 px-4 mb-4 items-center">
                <select
                    className="border p-1 rounded bg-white text-sm"
                    value={filterType}
                    onChange={e => {
                        setFilterType(e.target.value as "productName" | "productionName");
                        setActiveFilter("All");
                    }}
                >
                    <option value="productName">Product Name</option>
                    <option value="productionName">Production Name</option>
                </select>

                <button
                    className={`px-3 py-1 rounded-full text-sm border ${
                        activeFilter === "All" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                    }`}
                    onClick={() => setActiveFilter("All")}
                >
                    All
                </button>

                {uniqueFilterValues.map(value => (
                    <button
                        key={value}
                        className={`px-3 py-1 rounded-full text-sm border ${
                            activeFilter === value ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                        }`}
                        onClick={() => setActiveFilter(value)}
                    >
                        {value}
                    </button>
                ))}
            </div>

            {/!* Loading *!/}
            {loading && (
                <div className="flex justify-center items-center p-4">
                    <Loading />
                </div>
            )}

            {/!* Cards Grid *!/}
            {!loading && (
                <div className="flex flex-wrap gap-4 p-4">
                    {filteredData.map((mix, index) => (
                        <ProductMixCard key={index} mix={mix} />
                    ))}
                    {filteredData.length === 0 && (
                        <p className="text-center text-gray-500 w-full">No production mixes found.</p>
                    )}
                </div>
            )}
        </div>
    );*/

    return (
        <div>

        </div>
    )
}
