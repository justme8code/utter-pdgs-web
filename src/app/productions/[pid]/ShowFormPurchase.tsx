import {useProductionStore} from "@/app/store/productionStore";
import {FormPurchase} from "@/app/ui/form/purchaseForm/FormPurchase";

export const ShowFormPurchase = () => {
    const {selectedProduction} = useProductionStore();
    return (
        <div className={"flex justify-end w-full"}>
            {
                selectedProduction?.finalized ? null :  <FormPurchase/>
            }
        </div>
    );
};