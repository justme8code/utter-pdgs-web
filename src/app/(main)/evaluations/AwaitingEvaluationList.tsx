// src/components/productions/AwaitingEvaluationList.tsx

import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {TestTube} from 'lucide-react';
import {Production} from '@/app/types/production';

interface AwaitingEvaluationListProps {
    productions: Production[];
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const AwaitingEvaluationList = ({productions}: AwaitingEvaluationListProps) => {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Awaiting Evaluation</h2>
                <p className="text-muted-foreground">
                    These production batches have not been finalized and are ready for evaluation.
                </p>
            </div>
            <div
                className="border rounded-lg bg-background overflow-hidden"> {/* Added overflow-hidden for cleaner edges */}
                {productions && productions.length > 0 ? (
                    <div className="divide-y divide-border">
                        {productions.map((production) => (
                            // MODIFIED: Added transition and hover effect classes here
                            <div
                                key={production.id}
                                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 hover:shadow-md hover:bg-muted/50"
                            >
                                <div className="flex-1 space-y-1">
                                    <p className="font-semibold text-base">
                                        {production.name} ({production.productionNumber})
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Started on: {formatDate(production.startDate)}
                                    </p>
                                    {/* Assuming lastBatch is part of your type from the previous snippet */}
                                    {production.lastBatch > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Currently on batch: {production.lastBatch}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {production.productionStore?.ingredientStores.map(store => (
                                            <Badge key={store.id} variant="secondary">
                                                {store.ingredient.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button asChild size="sm">
                                    <Link href={`/evaluations/create?productionId=${production.id}`}>
                                        <TestTube className="mr-2 h-4 w-4"/> Start Evaluation
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12">
                        <h2 className="text-xl font-semibold">All Caught Up!</h2>
                        <p className="text-muted-foreground mt-2">
                            There are no new productions awaiting evaluation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};