
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";   // Shadcn Input
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Production } from "@/app/types";
import {Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateAProductionButton } from "@/app/components/production/CreateAProductionButton";
import ProductionList from "@/app/components/production/ProductionLIst"; // Assuming this is already styled or a Shadcn button

export const ClientProductionPagination = ({ productions: initialProductions }: { productions: Production[] }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPage = parseInt(searchParams.get("page") || "0", 10); // Keep page 0-indexed internally
    const initialSize = parseInt(searchParams.get("size") || "10", 10); // Default to 10 items per page

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize] = useState(initialSize); // If you want to make page size configurable later
    const [searchTerm, setSearchTerm] = useState("");

    // Filter productions based on search term
    const filteredProductions = useMemo(() => {
        if (!searchTerm.trim()) {
            return initialProductions;
        }
        return initialProductions.filter((prod) =>
            prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.staff?.userFullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialProductions, searchTerm]);

    // Paginate the filtered productions
    const paginatedProductions = useMemo(() => {
        const startIndex = currentPage * pageSize;
        return filteredProductions.slice(startIndex, startIndex + pageSize);
    }, [filteredProductions, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredProductions.length / pageSize);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString()); // Preserve other params
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        // Only push if params actually changed to avoid unnecessary re-renders/history entries
        if (searchParams.get("page") !== currentPage.toString() || searchParams.get("size") !== pageSize.toString()) {
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [currentPage, pageSize, router, searchParams]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
                <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
                    Productions Management
                </h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name, number, staff..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-8 w-full" // Padding for icon
                        />
                    </div>
                    {/* Assuming CreateAProductionButton is already a styled component or Shadcn Button */}
                    {/* If not, you can replace it with: */}
                    {/* <Button onClick={() => router.push('/productions/create')}> // Or your modal logic
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Production
                    </Button> */}
                    <CreateAProductionButton />
                </div>
            </div>

            {/* Production List */}
            <div className="bg-card border rounded-lg shadow-sm">
                <ProductionList
                    productions={paginatedProductions}
                    error={{ state: false, message: "" }} // Pass any actual error if available
                />
            </div>


            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                     <span className="text-sm text-muted-foreground">
                        Page {currentPage + 1} of {totalPages} ({filteredProductions.length} items)
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
            {filteredProductions.length === 0 && searchTerm && (
                <div className="text-center py-10 text-muted-foreground bg-card border rounded-lg shadow-sm">
                    {`No productions found matching "${searchTerm}".`}
                </div>
            )}
        </div>
    );
};