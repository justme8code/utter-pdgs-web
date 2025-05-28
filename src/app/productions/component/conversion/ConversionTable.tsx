'use client';
import {useConversionStore} from "@/app/store/conversionStore";
import {CComponent} from "@/app/productions/component/conversion/CComponent";
import {ProductMixPage} from "@/app/components/production/productMix/ProductMixPage";

export function ConversionTable() {
    const {conversions} = useConversionStore();

    return (
        <div className={"space-y-5 bg-gray-50"}>
            {conversions.length > 0 &&
                <div className={"space-y-5"}>
                    <h1 className={"text-xl font-medium"}>Conversions</h1>
                    <ProductMixPage/>
                </div>
            }

            <div className={"flex w-full flex-col space-y-5 max-h-[700px] overflow-y-auto"}>
                {
                    conversions.length > 0 && conversions.map((conversion,index) => (
                        <CComponent key={index} conversion={conversion}/>
                    ))
                }
            </div>
        </div>
    );
}
