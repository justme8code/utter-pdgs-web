import {useCallback, useEffect} from "react";
import {PurchaseTransfer} from "@/app/types";
import {fetchPurchaseTransfers} from "@/app/actions/purchaseTransfer";
import {TransferCard} from "@/app/ui/production/TransferCard";
import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseTransferStore} from "@/app/store/PurchaseTransferStore";

export const TransferList = () => {
    const {selectedProduction} = useProductionStore();
    const {purchaseTransfers,setPurchaseTransfers} = usePurchaseTransferStore();

    const handleFetchTransfers = useCallback(async () => {
            if(selectedProduction?.id){
                const {data,status} = await fetchPurchaseTransfers();
                if(data && status) {
                    setPurchaseTransfers(data.filter(value => value.fromProductionId !== selectedProduction?.id))
                }
            }
    },[selectedProduction?.id, setPurchaseTransfers]);

    useEffect(() => {
        handleFetchTransfers();
    },[handleFetchTransfers])


    return (
        <>
            {
                purchaseTransfers.length > 0 ?
                purchaseTransfers.map((transfer: PurchaseTransfer, index) => (
                        <TransferCard key={index} transfer={transfer} />
                    ))
                    : <p>No Balance available</p>
            }

        </>
    );
};