// src/components/evaluation-card.tsx
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {format} from 'date-fns';
import {ArrowRight, CalendarDays, User} from 'lucide-react';
import Link from 'next/link';

// Define the shape of a single product's data within an evaluation
interface ProductResult {
    title: string;
    release?: string; // "Yes", "No", or undefined
    // You can add other fields like taste, comments if needed
}

// Define the props for our EvaluationCard
export interface Evaluation {
    id: string; // Unique ID for linking, e.g., from your database
    name: string;
    batchRange: string;
    manufacturingDate: Date;
    expiryDate: Date;
    products: ProductResult[];
}

interface EvaluationCardProps {
    evaluation: Evaluation;
}

// Helper function to determine the overall release status
const getOverallStatus = (products: ProductResult[]): {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
} => {
    if (!products || products.length === 0) {
        return {text: 'No Products', variant: 'secondary'};
    }

    const releaseStatuses = products.map(p => p.release);
    const totalProducts = products.length;

    const releasedCount = releaseStatuses.filter(s => s === 'Yes').length;
    const rejectedCount = releaseStatuses.filter(s => s === 'No').length;

    if (releasedCount === totalProducts) {
        return {text: 'Fully Released', variant: 'default'}; // Will be green-ish with custom class
    }
    if (rejectedCount === totalProducts) {
        return {text: 'Rejected', variant: 'destructive'};
    }
    if (releasedCount > 0) {
        return {text: 'Partially Released', variant: 'secondary'};
    }
    if (rejectedCount > 0) {
        return {text: 'Needs Review', variant: 'outline'};
    }

    return {text: 'Pending', variant: 'outline'};
};


export const EvaluationCard = ({evaluation}: EvaluationCardProps) => {
    const status = getOverallStatus(evaluation.products);

    // Custom styling for the "Fully Released" badge
    const statusVariantClasses = {
        default: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100', // for 'Fully Released'
        destructive: '',
        secondary: '',
        outline: '',
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{evaluation.batchRange}</CardTitle>
                        <CardDescription className="flex items-center pt-2">
                            <User className="w-4 h-4 mr-2"/>
                            Evaluated by {evaluation.name}
                        </CardDescription>
                    </div>
                    <Badge variant={status.variant} className={statusVariantClasses[status.variant]}>
                        {status.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2"/>
                        <span>Mfg. Date: {format(evaluation.manufacturingDate, 'PPP')}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2"/>
                        <span>Expiry Date: {format(evaluation.expiryDate, 'PPP')}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/evaluations/${evaluation.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};