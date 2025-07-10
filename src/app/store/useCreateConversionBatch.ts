import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useConversionBatchStore} from '@/app/store/conversionBatchStore';
import {createProductionBatch} from '@/api/production';
import {ConversionBatch} from '@/app/types/new';
import {toast} from "sonner";

export function useCreateConversionBatch(productionId: number) {
    const queryClient = useQueryClient();
    const {addBatch, setActiveBatch} = useConversionBatchStore();

    return useMutation({
        mutationFn: async (): Promise<ConversionBatch | null> => {
            const {data, status} = await createProductionBatch(productionId);

            if (!status || !data) {
                throw new Error('Failed to create conversion batch');
            }

            return data;
        },
        onSuccess: (newBatch) => {
            if (newBatch) {
                setActiveBatch(newBatch.id); //  this will deactivate all others
                addBatch(newBatch); //  then we add the fresh one
                queryClient.invalidateQueries({queryKey: ['conversion-batches']});
                toast.success(`Batch "${newBatch.name}" created`);
            }
        },
    });
}
