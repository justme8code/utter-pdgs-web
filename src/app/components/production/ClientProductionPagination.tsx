// app/productions/ClientProductionPagination.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductionList from "./ProductionLIst";
import { ProductionResponse } from "@/app/data_types";
import { TextField } from "@/app/components/TextField";
import { CreateAProductionButton } from "@/app/components/production/CreateAProductionButton";
import {LoadData} from "@/app/LoadData";

export const ClientProductionPagination = ({ productions }: { productions: ProductionResponse[] }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPage = parseInt(searchParams.get("page") || "0", 10);
    const initialSize = parseInt(searchParams.get("size") || "100", 10);

    const [page, setPage] = useState(initialPage);
    const [size] = useState(initialSize);
    const [filteredProductions, setFilteredProductions] = useState(productions);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("size", size.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [page, router, size]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (!value.trim()) {
            setFilteredProductions(productions);
            return;
        }

        const filtered = productions.filter((prod) =>
            prod.name?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProductions(filtered);
    };

    return (
        <>
            <LoadData/>
            <nav className="flex justify-between items-center mb-4 bg-white w-full p-2">
                <h1 className="text-xl font-medium">Productions</h1>
                <div className="flex items-center gap-3">
                    <TextField
                        value={searchValue}
                        onChange={(e) => handleSearch(e)}
                        props={{ className: "bg-gray-300 p-1 px-4 outline-none border-none rounded-sm", placeholder: "Search Productions" }}
                        label=""
                    />
                    <CreateAProductionButton />
                </div>
            </nav>

            <div className={"p-4"}>
                <ProductionList productions={filteredProductions} error={{
                    state: false,
                    message: ""
                }} />


                {filteredProductions.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {page + 1}</span>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-2 py-2 bg-blue-500 text-white rounded"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
