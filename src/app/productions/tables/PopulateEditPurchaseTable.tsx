import {getAllRawMaterials, getAllSuppliers} from "@/app/actions/inventory";
import {ColumnType} from "@/app/components/production/EditableTable";
import {PopulateEditPurchases} from "@/app/productions/tables/PopulateEditPurchases";
import {ExtendedProductionResponse} from "@/app/data_types";


export async function PopulateEditPurchaseTable({production}:{production:ExtendedProductionResponse}) {

    // fetch materials
    const rawMaterials = await getAllRawMaterials();
    const suppliers = await getAllSuppliers();
    console.log(suppliers)
    const columns:ColumnType[] = [
        { key: "id", label: "S/N" },
        { key: "rawMaterials", label: "Selected Materials", type: "dropdown", options: rawMaterials?rawMaterials.data.map(value => value.name)?? []:[] },
        { key: "supplier", label: "Supplier", type: "dropdown", options: suppliers.data?suppliers.data.map(value => value.fullName)?? []:[]},
        { key: "uom", label: "UoM" },
        { key: "qty", label: "Qty", type: "number" },
        { key: "weight", label: "Weight(Kg)",type:"number" },
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