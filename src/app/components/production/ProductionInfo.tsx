'use client';
import {ProductionResponse} from "@/app/data_types";
import {useProductionStore} from "@/app/store/productionStore";
import {useEffect} from "react";
import StatusToggle from "@/app/components/production/StatusToggle";
import CurrentStatus from "@/app/components/production/CurrentStatus";

export const ProductionInfo = ({prod}:{prod:ProductionResponse}) => {
    const {setSelectedProduction} = useProductionStore();

    useEffect(() => {
        setSelectedProduction(prod);
    }, [prod, setSelectedProduction]);

    return (
        <>
            <div className={"flex sticky top-0 items-center gap-x-2 ring-1 bg-gray-50 ring-gray-200 p-2 justify-between "}>
                <h1 className={"text-xl"}>{prod.status === "RUNNING" || prod.status === "PAUSED" ? " On Going Production : ": "Production Completed" }</h1>
                <div className={"flex items-center gap-x-2 text-md font-bold"}>
                    <h1 className={""}>{prod.productionNumber}</h1>
                    <h1>|</h1>
                    <h1 className={" "}>{prod.name}</h1>
                </div>

                <div className={"flex items-center gap-5"}>

                    <CurrentStatus initialStatus={prod.status} />

                     <div className={"flex gap-5"}>
                         <div className={"flex"}>
                             <h1 className={"text-sm"}>Start date : </h1>
                             <h1 className={"text-sm font-bold"}>{prod.startDate}</h1>
                         </div>

                         <div className={"flex"}>
                             <h1 className={"text-sm"}>End date : </h1>
                             <h1 className={"text-sm font-bold"}>{prod.endDate}</h1>
                         </div>
                     </div>
                </div>
            </div>
        </>
    );
};