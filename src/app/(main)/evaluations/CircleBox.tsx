// /app/features/production-evaluation/CircleBox.tsx
'use client';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

interface CircleBoxProps {
    value?: string;
    onClick: () => void;
}

export const CircleBox: React.FC<CircleBoxProps> = ({value, onClick}) => {
    const displayClass =
        value === "ACCEPTABLE"
            ? 'bg-green-500 hover:bg-green-600'
            : value === "UNACCEPTABLE"
                ? 'bg-red-500 hover:bg-red-600'
                : '';

    return (
        <Button
            type="button"
            variant="outline"
            onClick={onClick}
            className="w-16 h-16 rounded-lg"
        >
            {value && (
                <div
                    className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-lg transition-colors',
                        displayClass
                    )}
                >
                    {value === "ACCEPTABLE" ? 1 : value === "UNACCEPTABLE" ? 2 : value}
                </div>
            )}
        </Button>
    );
};