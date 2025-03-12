"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProductions } from "@/app/productions/actions";
import ProductionList from "./ProductionLIst";
import { ProductionResponse } from "@/app/data_types";
import { TextField } from "@/app/components/TextField";
import { Search } from "lucide-react";
import {CreateProduction} from "@/app/productions/CreateProduction";
import {CreateAProductionButton} from "@/app/productions/CreateAProductionButton";


export const ProductionPagination = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPage = parseInt(searchParams.get("page") || "0", 10);
    const initialSize = parseInt(searchParams.get("size") || "100", 10);

    const [page, setPage] = useState(initialPage);
    const [size, setSize] = useState(initialSize);
    const [productions, setProductions] = useState<ProductionResponse[]>([]);
    const [filteredProductions, setFilteredProductions] = useState<ProductionResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [error, setError] = useState({ state: false, message: "" });
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false); // ✅ Track refresh state

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("size", size.toString());
        router.push(`?${params.toString()}`, { scroll: false });

        const getProductions = async () => {
            setLoading(true);
            const response = await fetchProductions(page, size);

            if (response.error.state) {
                setError(response.error);
                setProductions([]);
                setFilteredProductions([]);
            } else {
                setError({ state: false, message: "" });
                setProductions(response.data);
                setFilteredProductions(response.data);
            }

            setLoading(false);
        };

        getProductions();
    }, [page, size, refresh]); // ✅ Re-fetch when refresh changes

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
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Productions</h1>
                <div className="flex items-center gap-3">
                    <TextField
                        value={searchValue}
                        onChange={(e) => handleSearch(e)}
                        props={{ className: "bg-gray-300 p-2 px-4 outline-none border-none rounded-sm", placeholder: "Search Productions" }}
                        label=""
                    />
                    <CreateAProductionButton onCreated={() => setRefresh(prev => !prev)} /> {/* ✅ Pass callback */}
                </div>
            </div>

            {loading ? <p>Loading...</p> : <ProductionList productions={filteredProductions} error={error} />}

            {filteredProductions.length < 1 && searchValue === "" && (
                <div className="flex flex-col w-full items-center justify-center p-8 ">
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Production Space</h1>
                    <CreateAProductionButton onCreated={() => setRefresh(prev => !prev)} />
                    <p className="text-gray-500 mt-10">No productions yet. Start by creating one!</p>
                </div>
            )}

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
    );
};
