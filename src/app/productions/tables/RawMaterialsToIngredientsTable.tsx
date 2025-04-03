import {ColumnType} from "@/app/productions/EditableTable";
import {RawMaterialsToIngredients} from "@/app/productions/tables/RawMaterialsToIngredients";
import {ExtendedProductionResponse} from "@/app/data_types";

const columns:ColumnType[] = [
    { key: "id", label: "S/N" },
    { key: "rawMaterials", label: "Total Raw Materials", type: "text"},
    { key: "totalUsable", label: "Total Usable (Kg)",type: "number" },
    { key: "batch", label: "Batch",type: "number" },
    { key: "ingredient", label: "Ingredient", type:"text",info:true},
    { key: "outputLitres", label: "Output Litres",type: "number" },
    { key: "productionLost", label: "Production Litres Lost(kg)",type:"number"},
    { key: "usableLitres", label: "Usable Litres", type: "number" },
    { key: "litres/kg", label: "Litres/Kg", type: "number" },
    { key: "cost/litre", label: "Cost/Litre", type: "number" },
    { key: "rawBrix", label: "Raw Brix", type: "number" }
];

export const RawMaterialsToIngredientsTable = ({production}:{production:ExtendedProductionResponse}) => {
    return (
        <>
            <RawMaterialsToIngredients production={production} columns={columns}/>
        </>
    );
};