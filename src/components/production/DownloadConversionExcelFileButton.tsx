'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteProduction } from '@/api/production';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {toast} from "sonner";

export const DownloadPurchaseExcelFileButton = ({ productionId }: { productionId: number }) => {

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const { status } = await deleteProduction(productionId);
            if (!status) {
                throw new Error('Delete failed');
            }
            toast.success("Successfully deleted production");
            return status;
        },
        onSuccess: () => {
            console.log('Successfully deleted production!');
            router.push('/productions');
        },
        onError: (err) => {
            console.error('Error deleting production:', err);
            toast.error(err.message);

        },
    });

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
        >
            {mutation.isPending ? 'Deleting...' : 'Delete Production'}
        </Button>
    );
};
