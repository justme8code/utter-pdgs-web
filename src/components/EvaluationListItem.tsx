// src/components/evaluation-list-item.tsx
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {CalendarDays, ChevronRight, User} from 'lucide-react';
import Link from 'next/link';

// Define the shape of a single product's data
interface ProductResult {
    title: string;
    release?: string; // "Yes", "No", or undefined
}

// Define the props for our list item
export interface Evaluation {
    id: string; // Unique ID for linking
    name: string;
    batchRange: string;
    manufacturingDate: Date;
    expiryDate: Date;
    products: ProductResult[];
}

interface EvaluationListItemProps {
    evaluation: Evaluation;
}

// Helper function to determine the overall release status
const getOverallStatus = (products: ProductResult[]): {
    text: string;
    className: string;
} => {
    if (!products || products.length === 0) {
        return {text: 'No Products', className: 'bg-gray-100 text-gray-800'};
    }

    const totalProducts = products.length;
    const releasedCount = products.filter(p => p.release === 'Yes').length;
    const rejectedCount = products.filter(p => p.release === 'No').length;

    if (releasedCount === totalProducts) {
        return {text: 'Fully Released', className: 'bg-green-100 text-green-800 border-green-200'};
    }
    if (rejectedCount > 0 && releasedCount === 0) {
        return {text: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200'};
    }
    if (releasedCount > 0) {
        return {text: 'Partially Released', className: 'bg-yellow-100 text-yellow-800 border-yellow-200'};
    }

    return {text: 'Pending Review', className: 'bg-blue-100 text-blue-800 border-blue-200'};
};

export const EvaluationListItem = ({evaluation}: EvaluationListItemProps) => {
    const status = getOverallStatus(evaluation.products);

    return (
        <Link
            href={`/evaluations/${evaluation.id}`}
            className="block"
        >
            <div className="flex items-center p-4 border-b transition-colors hover:bg-muted/50 last:border-b-0">
                {/* Main Info */}
                <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">{evaluation.batchRange}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3"/>
                        <span>{evaluation.name}</span>
                    </div>
                </div>

                {/* Date Info (hidden on small screens) */}
                <div className="hidden md:flex flex-1 items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4"/>
                        <span>{format(evaluation.manufacturingDate, 'dd MMM yyyy')}</span>
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-1 justify-start md:justify-center">
                    <Badge variant="outline" className={cn("font-semibold", status.className)}>
                        {status.text}
                    </Badge>
                </div>

                {/* Action Chevron */}
                <div className="flex justify-end ml-4">
                    <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                </div>
            </div>
        </Link>
    );
};