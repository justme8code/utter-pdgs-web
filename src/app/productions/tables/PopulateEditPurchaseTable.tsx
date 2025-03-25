import {getAllMaterials} from "@/app/inventory/actions";
import {ColumnType} from "@/app/productions/EditableTable";
import {PopulateEditPurchases} from "@/app/productions/tables/PopulateEditPurchases";
import {ExtendedProductionResponse, ProductionResponse} from "@/app/data_types";


export async function PopulateEditPurchaseTable({production}:{production:ExtendedProductionResponse}) {

    // fetch materials
    const {data} = await getAllMaterials();

    const columns:ColumnType[] = [
        { key: "id", label: "S/N" },
        { key: "rawMaterials", label: "Selected Materials", type: "dropdown", options: data?data.map(value => value.name)?? []:[] },
        { key: "supplier", label: "Supplier", type: "dropdown", options: ["Pineapple", "Banana", "Orange"] },
        { key: "uom", label: "UoM" },
        { key: "qty", label: "Qty", type: "number" },
        { key: "weight", label: "Weight(Kg)" },
        { key: "productionLost", label: "Production Lost Weight(kg)", type: "number"},
        { key: "usable", label: "Usable Weight(Kg)", type: "number" },
        { key: "cost", label: "Cost", type: "number" },
        { key: "avgCost", label: "Avg Cost(Kg)", type: "number" },
        { key: "avgWeightPerUOM", label: "Avg Weight per UOM", type: "number" },
    ];



    return (
        <>
              <PopulateEditPurchases production={production} columns={columns}/>
        </>
    );
}