import {Conversion, Purchase} from "@/app/types";
import React, {useEffect, useState} from "react";
import {ReadonlyConversion} from "@/app/productions/component/conversion/ReadOnlyConversion";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {beautifyDate} from "@/app/utils/functions";

export const CComponent = ({conversion}:{conversion:Conversion}) => {
    const {getPurchase} = usePurchaseStore();
    const [purchase,setPurchase] = useState<Purchase>();

    useEffect(() => {
        if(!conversion.purchaseId)return;
        setPurchase(getPurchase(conversion.purchaseId))
    }, [conversion.purchaseId, getPurchase, purchase]);
    return (
        <div className={"bg-gray-100 p-4 rounded-sm space-y-2 items-center"}>
            <div className={"flex justify-start text-sm font-medium text-gray-600 gap-4"}>
                <div>

                    Date : {beautifyDate(conversion.createdAt).formatted}
                </div>
                 <div>
                     {beautifyDate(conversion.createdAt).relative}
                 </div>
            </div>
            {purchase && purchase.id && <div className={"flex  gap-4 "}>
                <div className={"flex gap-4 w-full max-w-lg"}>
                    <div className="">
                        <label className="block text-gray-700 text-sm font-bold mb-3">
                            Raw Material
                        </label>
                        <input
                            readOnly={true}
                            value={purchase.rawMaterial.name}
                            className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                        />
                    </div>
                    <div className="">
                        <label className="block text-gray-700 text-sm font-bold mb-3">
                            Total Usable
                        </label>
                        <input
                            readOnly={true}
                            value={purchase.usableWeight}
                            className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                        />
                    </div>

                    <div className="">
                        <label className="block text-gray-700 text-sm font-bold mb-3">
                            Purchase Id
                        </label>
                        <input
                            readOnly={true}
                            value={purchase.id}
                            className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                        />
                    </div>

                    <div className="">
                        <label className="block text-gray-700 text-sm font-bold mb-3">
                            Batch
                        </label>
                        <input
                            readOnly={true}
                            value={`bn_${conversion.batch}`}
                            className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded   max-w-24"
                        />
                    </div>

                </div>

                <div className="flex flex-wrap gap-2">
                    {conversion.fields.map((field, index) => (
                         !isNaN(field.kgUsed) && field.kgUsed !== 0.0 ? <ReadonlyConversion key={index} field={field} showLabel={index==0} />:null
                    ))}
                </div>
            </div>}
        </div>
    );
};