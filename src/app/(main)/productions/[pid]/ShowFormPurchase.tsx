import {useProductionStore} from "@/app/store/productionStore";
import {FormPurchase} from "@/app/ui/form/purchaseForm/FormPurchase";

export const ShowFormPurchase = () => {
    const {selectedProduction} = useProductionStore();

    if (!selectedProduction?.finalized) {
        return <FormPurchase/>
    }
    return null;
};