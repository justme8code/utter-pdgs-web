// /app/features/production-evaluation/InstructionsSection.tsx

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export const InstructionsSection = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                    This evaluation is aimed at testing or checking the quality parameter of the juice samples in other
                    to make amends
                    where necessary using sensory evaluation, it will be done using the 2 point hedonic scale. We employ
                    you to pick the number that meets your perception of juice
                    samples as listed below.
                </p>
                <ul className="list-disc pl-5 font-medium">
                    <li><strong className="text-foreground">1:</strong> Acceptable</li>
                    <li><strong className="text-foreground">2:</strong> Unacceptable</li>
                </ul>
            </CardContent>
        </Card>
    );
};