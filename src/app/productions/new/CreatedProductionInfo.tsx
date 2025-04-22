'use client';
import {CreateAProductionButton} from "@/app/components/production/CreateAProductionButton";
import {useCreateProductionStore} from "@/app/store/createdProductionStore";

import {ProductionResponse} from "@/app/data_types";


const ProdInf = ({prod}:{prod:ProductionResponse})=>{
    return (
        <div className={"flex sticky top-0 items-center gap-x-2 ring-1 bg-gray-50 ring-gray-200 p-2 justify-between "}>
            <div className={"flex items-center gap-x-2 text-md font-bold"}>
                <h1 className={" "}>{prod.name}</h1>
            </div>
            <div className={"flex items-center gap-5"}>
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
    )
}

export const CreatedProductionInfo = () => {
    const {production} = useCreateProductionStore();
    return (
        <>

            <main className="flex gap-20 flex-col w-full h-screen  space-x-10">
                {!production && (
                    <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center w-full">
                        <div className="text-xl font-medium">
                            Create New Production
                        </div>

                    </nav>
                )}
                <div className="flex-1 flex flex-col h-full p-2 gap-5">
                    {!production ? (
                        <div className="flex flex-col w-full items-center justify-center p-8 ">

                            <CreateAProductionButton />
                            <p className="text-gray-500 mt-10">Create a production by clicking the button above!</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {production && (
                                <div>
                                    <ProdInf prod={production} />
                                    <div className="space-y-10">

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};