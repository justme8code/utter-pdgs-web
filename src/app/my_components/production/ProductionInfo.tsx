'use client';
import {useProductionStore} from "@/app/store/productionStore";
export const ProductionInfo = () => {
    const {selectedProduction} = useProductionStore();


    return (
        <>
            {selectedProduction &&  <div className={"flex sticky top-0 items-center gap-x-2 bg-white  justify-between p-5 z-10"}>
                {/*<h1 className={"text-xl"}>{prod.status === "RUNNING" || prod.status === "STOPPED" ? " On Going Production : ": "Production Completed" }</h1>*/}
                <div className={"flex items-center gap-x-2 font-bold"}>
                    <h1 className={"text-2xl"}>{selectedProduction.name}</h1>
                    <h1>|</h1>
                    <h1 className={"text-gray-500"}>{selectedProduction.productionNumber}</h1>

                </div>

                <div className={"flex items-center gap-5"}>

                    {/*<CurrentStatus initialStatus={prod.status} />*/}

                    <div className={"flex gap-5 items-center"}>
                        <p className={"font-bold"}>
                            {selectedProduction.finalized ? "Completed":"Ongoing"}
                        </p>
                        <div className={"flex"}>
                            <h1 className={"text-sm"}>Start date : </h1>
                            <h1 className={"text-sm font-bold"}>{selectedProduction.startDate}</h1>
                        </div>

                        <div className={"flex"}>
                            <h1 className={"text-sm"}>End date : </h1>
                            <h1 className={"text-sm font-bold"}>{selectedProduction.endDate}</h1>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
};