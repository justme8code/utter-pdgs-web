'use client';
import React, { useEffect, useState, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ProductMix } from "@/app/product";
import { fetchProductMixes } from "@/app/actions/production";
import { TextField } from "@/app/components/TextField";

const customStyles = {
    header: {
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#626567',
            backgroundColor: '#fafafa',
        },
    },
    rows: {
        style: {
            fontSize: '16px',
            color: '#374151',
            '&:hover': {
                backgroundColor: '#E2E8F0',
            },
        },
    },
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#303030',
            backgroundColor: '#f3f3f3',
        },
    },
    cells: {
        style: {
            fontSize: '16px',
            color: '#4A5568',
        },
    },
};

const columns: TableColumn<ProductMix>[] = [
    {
        name: 'S/N',
        selector: (row, index) => (index != undefined ? index + 1 : 1),
        sortable: true,
    },
    {
        name: 'Product ID',
        selector: row => row.productId,
        sortable: true,
    },
    {
        name: 'Production ID',
        selector: row => row.productionId,
        sortable: true
    },
    {
        name: 'Total Liters Used',
        selector: row => row.totalLitersUsed?.toFixed(2) || 'N/A',
        sortable: true,
    },
    {
        name: 'Initial Brix',
        selector: row => row.initialBrix?.toFixed(2) || 'N/A',
        sortable: true,
    },
    {
        name: 'Final Brix',
        selector: row => row.finalBrix?.toFixed(2) || 'N/A',
        sortable: true,
    },
    {
        name: 'Initial PH',
        selector: row => row.initialPH?.toFixed(2) || 'N/A',
        sortable: true,
    },
    {
        name: 'Final PH',
        selector: row => row.finalPH?.toFixed(2) || 'N/A',
        sortable: true,
    },
];

export default function ProductMixPage() {
    const [data, setData] = useState<ProductMix[]>([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 100,
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFetchProductMixes = useCallback(
        async (page: number, size: number, query: string = "") => {
            setLoading(true);
            try {
                const { data: responseData, status } = await fetchProductMixes(page, size, query);
                if (status) {
                    setData(responseData?.content || []);
                    setTotalPages(responseData?.totalPages || 0);
                } else {
                    console.error("Failed to fetch product mixes");
                    setData([]);
                    setTotalPages(0);
                    // Optionally show an error message to the user
                }
            } catch (error) {
                console.error("Error fetching product mixes:", error);
                setData([]);
                setTotalPages(0);
                // Optionally show an error message to the user
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        handleFetchProductMixes(pagination.page, pagination.size, searchQuery);
    }, [handleFetchProductMixes, pagination.page, pagination.size, searchQuery]);

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleRowsPerPageChange = (newPerPage: number) => {
        setPagination({ page: 0, size: newPerPage });
    };

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        // The API call will now be triggered by the useEffect with the debounce
        setPagination({ page: 0, size: pagination.size }); // Reset page on new search input
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFetchProductMixes(pagination.page, pagination.size, searchQuery);
        }, 500); // Increased debounce delay to 500ms

        return () => clearTimeout(timer);
    }, [searchQuery, pagination.page, pagination.size, handleFetchProductMixes]);

    return (
        <div>
            {/* Search Bar */}
            <nav className="flex justify-between items-center mb-4 bg-white w-full p-2">
                <h1 className="text-xl font-medium">Production Mixes</h1>
                <div className="flex items-center gap-3">
                    <TextField
                        value={searchQuery}
                        onChange={(e) => {
                            handleSearchChange(e)
                        }}
                        props={{ className: "bg-gray-300 p-1 px-4 outline-none border-none rounded-sm", placeholder: "Search production mixes" }}
                        label=""
                    />
                </div>
            </nav>

            {/* DataTable */}
            <div className={"p-4"}>
                <DataTable

                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    pagination
                    paginationServer
                    paginationTotalRows={totalPages}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={loading}
                />
            </div>
        </div>
    );
}