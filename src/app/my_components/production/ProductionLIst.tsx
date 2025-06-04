
"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Production } from "@/app/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Shadcn Table
import { Badge } from "@/components/ui/badge";   // Shadcn Badge
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Shadcn Alert
import { AlertTriangle, CalendarDays, UserCircle, Briefcase, } from "lucide-react";
import { format } from "date-fns/format"; // For date formatting

interface ProductionListProps {
    productions: Production[];
    error: { state: boolean; message: string };
}

export default function ProductionList({ productions, error }: ProductionListProps) {
    const router = useRouter();

    if (error.state) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch {
            return "Invalid Date";
        }
    };

    return (
        <div className="w-full"> {/* Removed extra bg-white and shadow as parent card handles it */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead className="w-[150px]">Prod. Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[180px]">Managed By</TableHead>
                            <TableHead className="w-[130px]">Start Date</TableHead>
                            <TableHead className="w-[130px]">End Date</TableHead>
                            <TableHead className="w-[120px] text-center">State</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productions.length > 0 ? (
                            productions.map((production) => (
                                <TableRow
                                    key={production.id}
                                    className="hover:bg-muted/50 cursor-pointer"
                                    onClick={() => router.push(`/productions/${production.id}`)}
                                >
                                    <TableCell className="font-medium">{production.id}</TableCell>
                                    <TableCell>{production.productionNumber || "N/A"}</TableCell>
                                    <TableCell>{production.name}</TableCell>
                                    <TableCell>
                                        {production.staff ? (
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                {production.staff.userFullName}
                                            </div>
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                            {formatDate(production.startDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                            {formatDate(production.endDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={production.finalized ? "default" : "secondary"}
                                            className={production.finalized
                                                ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-300 dark:border-green-600"
                                                : "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600"
                                            }
                                        >
                                            {production.finalized ? "Completed" : "Ongoing"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <Briefcase className="h-10 w-10" />
                                        <p className="font-medium">No productions found.</p>
                                        <p className="text-sm">Try adjusting your search or creating a new production.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}