'use client';
import { useEffect, useState } from "react";
import EditableTable, { ColumnType, DataType, RowType } from "../EditableTable";
import { ExtendedProductionResponse } from "@/app/data_types";
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";
import { createProductionDynamicData } from "@/app/productions/actions";
import useRawMaterialsToIngredientsTable from "@/app/store/useRawMaterialsToIngredientsTable";

const tableKey = 'rawMaterialsToIngredients';
const foreign = 'populateEditPurchases';

type TableType = {
    id: number,
    "rawMaterials": string,
    "totalUsable": number,
    ingredient: string,
    "outPutLitres": number,
    "productionLost": number,
    "usableLitres": number,
    "litres/kg": number,
    "cost/litre": number,
    "rawBrix": number,
};

export const RawMaterialsToIngredients = ({ production, columns }: { production: ExtendedProductionResponse, columns: ColumnType[] }) => {
    const [editableData, setEditableData] = useState<DataType[]>([]);
    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);
    const { table } = usePopulatePurchasesStore();
    const { rTable,updateRTable } = useRawMaterialsToIngredientsTable();

    useEffect(() => {
        // Map to only include id and rawMaterials

        const s:DataType[] = production.dynamicData[tableKey];
        if(s===undefined && table.length > 0){
            const newKindOfData: DataType[] = table.map((value) => {
                return {
                    id: value.id,
                    "rawMaterials": value["rawMaterials"],
                };
            });


            updateRTable(newKindOfData);
        }


        else if (table.length > 0){
            // Map to only include id and rawMaterials

            const l:DataType[] = s.map((value, index) => {
                const d = table[index];
                return {
                    "id" : d.id,
                    "rawMaterials" : d["rawMaterials"],
                    "totalUsable": value["totalUsable"],
                    "ingredient": value["ingredient"],
                    "outPutLitres": value["outPutLitres"],
                    "productionLost": value["productionLost"],
                    "usableLitres": value["usableLitres"],
                    "litres/kg": value["litres/kg"],
                    "cost/litre": value["cost/litre"],
                    "rawBrix": value["rawBrix"],
                }
            })
            updateRTable(l);
        }
    }, [production.dynamicData, table, updateRTable]); // Add table as dependency to trigger the effect when it changes
    const handleSubmitData = async () => {
        const result = await createProductionDynamicData<typeof editableData>(production.id, {
            [foreign]: table, // Send the entire updated dynamicData
            [tableKey]: rTable,
        });

        if (result) {
            setSavedSuccessfully(true);
        }
        console.log("Console log in submit", editableData);
        console.log("console loging table " ,table);
        console.log("Console loging handles submitData ", rTable);
    };

    // Handle row update
    const handleUpdate = (updatedRow: RowType) => {
        setEditableData((prevData) =>
            prevData.map((row) => (row.id === updatedRow.id ? { ...row, ...updatedRow } : row))
        );
    };


    return (
        <div className="p-4">
            <h1 className="font-bold text-xl mb-4">Raw Materials To Ingredients</h1>


            <EditableTable
                onChange={(data) => {
                    updateRTable(data);
                }}
                columns={columns}
                data={rTable}
                onUpdate={handleUpdate}
                disableFields={() => ["rawMaterials","id"]}
            />

            <div className="mt-4 p-4 space-x-2">
                <button
                    onClick={handleSubmitData}
                    className="p-1 px-4 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition"
                >
                    Save
                </button>
            </div>

        </div>
    );
};
