'use client';
import {useProductionStore} from "@/app/store/productionStore";
import {ReactNode} from "react";
import {usePurchaseStore} from "@/app/store/purchaseStore";


const Container = ({title,children}:{title:string,children:ReactNode})=>{

    return(
        <div className={"border border-gray-300 p-2 rounded-sm space-y-2 "}>
             <h1 className={"font-semibold"}>{title}</h1>
            <div className={"grid grid-cols-3 gap-2"}>
                {children}
            </div>
        </div>
    );
}
export const ProductionStore = () => {
    const {selectedProduction} = useProductionStore();
    const {purchases} = usePurchaseStore();
    return (
        <div className={"flex gap-4"}>

               <Container title={"Liters/kg Remaining"}>
                   {selectedProduction && selectedProduction.productionStore?.ingredientStores.map((value, index) => (
                       <div key={index} className={"space-x-4 bg-gray-100 p-2 rounded-sm"}>
                                  <span className="text-sm font-semibold text-gray-700">
                                    {value.ingredient.name}:
                                  </span>
                                <span className="text-sm font-mono font-semibold text-green-600">
                                    {value.usableLitresLeft}L
                                  </span>
                       </div>
                   ))}
               </Container>

            <Container title={"Raw material qty"}>
                {purchases && purchases.map((value, index) => (
                    <div key={index} className={"space-x-4 bg-gray-100 p-2 rounded-sm"}>
                                  <span className="text-sm font-semibold text-gray-700">
                                    {value.rawMaterial?.name??""}:
                                  </span>
                        <span className="text-sm font-mono font-semibold text-green-600">
                                    {value.purchaseUsage?.usableWeightLeft}
                        </span>

                        <div className={"flex items-center space-x-2"}>
                            <h1 className={"text-sm font-semibold text-gray-700"}>Used:</h1>
                            <span className="text-sm font-mono font-semibold text-red-600">
                                    {value.purchaseUsage?.totalKgUsed}  {value.rawMaterial?.uom}
                            </span>
                        </div>
                    </div>
                ))}
            </Container>


        </div>
    );
};