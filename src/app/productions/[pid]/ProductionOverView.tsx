'use client';
import {useProductionStore} from "@/app/store/productionStore";
import {Conversion, Production, Purchase} from "@/app/types";
import {useEffect} from "react";
import {ProductionInfo} from "@/app/my_components/production/ProductionInfo";
import {ProductionStore} from "@/app/productions/component/ProductionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {useConversionStore} from "@/app/store/conversionStore";
import {BalanceSidebar} from "@/app/ui/dailog/BalanceSidebar";
import {TransferList} from "@/app/ui/production/TransferList";

interface Prop {
    production:Production;
    purchases:Purchase[];
    conversions:Conversion[];
}
export default function ProductionOverView({data}:{data: Prop}) {
    const {selectedProduction,setSelectedProduction} = useProductionStore();
    const {setPurchases} = usePurchaseStore();
    const {setConversions} = useConversionStore();

    useEffect(() => {
        if(data){
            setSelectedProduction(data.production);
            setPurchases(data.purchases);
            setConversions(data.conversions);
        }
    }, [data, setConversions, setPurchases, setSelectedProduction]);

    return (
        <div className="w-full">
            {/* Wrap all production-related my_components in WithRole */}
            <ProductionInfo />
            <div className={"flex w-full p-4 items-start justify-between"}>
                <ProductionStore/>
                {selectedProduction && !selectedProduction.finalized &&  <BalanceSidebar><TransferList/></BalanceSidebar>}
            </div>
        </div>
    );
}
