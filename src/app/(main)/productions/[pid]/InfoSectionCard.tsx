// app/your-path/InfoSectionCard.tsx (New component file or inline if preferred)
import React, {ReactNode} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {cn} from '@/lib/utils';

interface InfoSectionCardProps {
    title: string;
    description?: string;
    icon?: React.ElementType; // Lucide icon component
    children: ReactNode;
    gridCols?: string; // e.g., "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    className?: string;
}

export const InfoSectionCard: React.FC<InfoSectionCardProps> = ({
                                                                    title,
                                                                    description,
                                                                    icon: Icon,
                                                                    children,
                                                                    gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3", // Default grid columns for items
                                                                    className,
                                                                }) => {
    return (
        <Card
            className={cn("flex-1 min-w-[300px]", className)}> {/* flex-1 to allow cards to grow, min-w for smaller screens */}
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-5 w-5 text-primary"/>}
                    <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
                </div>
                {description && <CardDescription className="text-xs pt-1">{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className={cn("grid gap-3", gridCols)}>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};