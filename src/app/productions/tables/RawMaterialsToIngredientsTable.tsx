import {ColumnType} from "@/app/productions/EditableTable";
import {RawMaterialsToIngredients} from "@/app/productions/tables/RawMaterialsToIngredients";
import {ExtendedProductionResponse} from "@/app/data_types";

const columns:ColumnType[] = [
    { key: "id", label: "S/N" },
    { key: "rawMaterials", label: "Raw Materials", type: "dropdown", options: ["Pineapple", "Banana", "Orange"] },
    { key: "totalUsable", label: "Total Usable (Kg)" },
    { key: "ingredient", label: "Ingredient" },
    { key: "outputLitres", label: "Output Litres" },
    { key: "productionLost", label: "Production Litres Lost(kg)"},
    { key: "usableLitres", label: "Usable Litres", type: "number" },
    { key: "litres/kg", label: "Litres/Kg", type: "number" },
    { key: "cost/litre", label: "Cost/Litre", type: "number" },
    { key: "rawBrix", label: "Raw Brix"},
];

export const RawMaterialsToIngredientsTable = ({production}:{production:ExtendedProductionResponse}) => {
    return (
        <>
            <RawMaterialsToIngredients production={production} columns={columns}/>
        </>
    );
};