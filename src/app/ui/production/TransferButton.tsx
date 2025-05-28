import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {useLoadingUI} from "@/app/store/useLoadingUI";
import LoadingWrapper from "@/app/components/LoadingWrapper";
import {createPurchaseTransfer} from "@/app/actions/purchaseTransfer";
import {usePurchaseTransferStore} from "@/app/store/PurchaseTransferStore";


export const TransferButton = ({ purchaseToTransfer }: { purchaseToTransfer: number }) => {
    const { selectedProduction } = useProductionStore();
    const { purchases, setPurchases } = usePurchaseStore();
    const { loading, setLoading, setSuccessMessage } = useLoadingUI();
    const {removePurchaseTransfer} = usePurchaseTransferStore();

    const handleCreateTransfer = async () => {
        setLoading(true);
        if (selectedProduction?.id) {
            const { data, message } = await createPurchaseTransfer(
                selectedProduction.id,
                purchaseToTransfer
            );
            setSuccessMessage(message);
            setPurchases([data.purchase,...purchases]);
            removePurchaseTransfer(data.purchaseTransfer.id);
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={handleCreateTransfer}
                className="p-2 bg-gray-200 hover:bg-sky-700 hover:text-white duration-200 rounded-md w-full"
            >
                Transfer to this production
            </button>
            <LoadingWrapper isLoading={loading} />
        </>
    );
};
