'use client';

import Link from 'next/link';
import {format} from 'date-fns';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from "@/components/ui/avatar"; // No need for AvatarImage anymore
import {Evaluation, Production} from '@/app/types';
import {ArrowRightIcon, PlusCircledIcon} from '@radix-ui/react-icons';

interface EvaluationsListClientProps {
    initialEvaluations: Evaluation[];
    production: Production;
}

export function EvaluationsListClient({initialEvaluations, production}: EvaluationsListClientProps) {

    const getStatusVariant = (type: Evaluation['evaluationType']) => {
        // This function is unchanged
        switch (type) {
            case 'IN_PROCESS':
                return 'secondary';
            case 'POST_PROCESS':
                return 'default';
            default:
                return 'outline';
        }
    };

    // Helper to get initials from a full name, with a fallback
    const getInitials = (name?: string) => {
        if (!name) return '??'; // Fallback for missing names
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">Production Evaluations</CardTitle>
                    <CardDescription>
                        Showing all evaluations for Batch Range: {production.lastBatch}
                    </CardDescription>
                </div>
                <Button asChild>
                    <Link href={`/evaluations/create?productionId=${production.id}`}>
                        <PlusCircledIcon className="mr-2 h-4 w-4"/>
                        Add New Evaluation
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Evaluated By</TableHead>
                            <TableHead>Manufactured Date</TableHead>
                            <TableHead className="text-center">Products Rated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialEvaluations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No evaluations found for this production.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialEvaluations.map((evaluation) => (
                                <TableRow key={evaluation.id}>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(evaluation.evaluationType)}>
                                            {evaluation.evaluationType?.replace('_', ' ')}
                                            {evaluation.id}
                                        </Badge>
                                    </TableCell>

                                    {/* --- SIMPLIFIED STAFF CELL --- */}
                                    <TableCell>
                                        {/* Check if the staff object exists */}
                                        {evaluation.staff ? (
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{getInitials(evaluation.staff.userFullName)}</AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className="font-medium truncate">{evaluation.staff.userFullName}</span>
                                            </div>
                                        ) : (
                                            // Fallback if the staff object is missing for some reason
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {format(new Date(evaluation.manufacturedDate), 'PPP')}
                                    </TableCell>

                                    <TableCell className="text-center font-medium">
                                        {evaluation.productionEvaluations?.length ?? 0}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/evaluations/${evaluation.id}`}>
                                                View Details
                                                <ArrowRightIcon className="ml-2 h-4 w-4"/>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}