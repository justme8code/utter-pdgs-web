'use client';
import { useEffect, useState } from "react";
import EditableTable, { ColumnType, DataType, RowType } from "../EditableTable";
import { ExtendedProductionResponse } from "@/app/data_types";
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";
import { createProductionDynamicData } from "@/app/productions/actions";
import useRawMaterialsToIngredientsTable from "@/app/store/useRawMaterialsToIngredientsTable";

const tableKey = 'rawMaterialsToIngredients';
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
        if(table.length > 0){
            const newKindOfData: DataType[] = table.map((value) => {
                return {
                    id: value.id,
                    "rawMaterials": value["rawMaterials"],
                };
            });
            updateRTable(newKindOfData);
        }
    }, [table, updateRTable]); // Add table as dependency to trigger the effect when it changes
    // Handle form submission
    const handleSubmitData = async () => {
        const result = await createProductionDynamicData<typeof editableData>(production.id, {
            [tableKey]: editableData, // Send the entire updated dynamicData
        });

        if (result) {
            setSavedSuccessfully(true);
        }
        console.log("Console log in submit", editableData);
    };

    // Handle row update
    const handleUpdate = (updatedRow: RowType) => {
        setEditableData((prevData) =>
            prevData.map((row) => (row.id === updatedRow.id ? { ...row, ...updatedRow } : row))
        );
    };

    // Handle row deletion
    const handleDelete = (id: number) => {
        setEditableData((prevData) =>
            prevData.filter((row) => row.id !== id)
        );
    };

    /*// Handle adding new row
    const handleAddRow = () => {
        const newRow = { id: Date.now(), rawMaterials: '' }; // Add empty row with default values
        setEditableData([...editableData, newRow]); // Add new row to the table
    };*/

    return (
        <div className="p-4">
            <h1 className="font-bold text-xl mb-4">Raw Materials To Ingredients</h1>

            {
                table.map((row) => (
                    <p key={row.id}></p>
                ))
            }
            {
                 rTable &&  <EditableTable
                    onChange={(data) => {
                        updateRTable(data);
                    }}
                    columns={columns}
                    data={rTable}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onAdd={newRow => {}} // Implement the add row functionality
                />
            }

            {savedSuccessfully && <p className="text-green-500 mt-2">Update saved successfully!</p>}

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
