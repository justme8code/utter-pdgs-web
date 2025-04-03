'use client';
import {useCallback, useEffect, useState} from 'react';
import EditableTable, {ColumnType, DataType, RowType} from '../EditableTable';
import {ExtendedProductionResponse} from '@/app/data_types';
import {createProductionDynamicData} from '@/app/productions/actions';
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";
import {calculateCostPerLitre, calculateLitresPerKg} from "@/app/production-computing-formulas";
import {getIngredientsByRawMaterialNames} from "@/app/inventory/actions";

const tableKey = 'rawMaterialsToIngredients';
const foreign = 'populateEditPurchases';

export const RawMaterialsToIngredients = ({ production, columns }: { production: ExtendedProductionResponse, columns: ColumnType[] }) => {
    const [editableData, setEditableData] = useState<DataType[]>(production.dynamicData[tableKey] || []);
    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);
    const [ingredients, setIngredients] = useState<string>("");
    const { table } = usePopulatePurchasesStore();

    const makeChanges = useCallback(() => {
        if (!table || table.length === 0) return;
        setEditableData((prevEditableData) => { // Use the functional update form
            return table.map((value) => {
                const existingRow = prevEditableData.find((row) => row.id === value.id);
                return {
                    ...existingRow,
                    id: value.id,
                    rawMaterials: value.rawMaterials,
                    totalUsable: value.usable,
                    productionLost: value.productionLost,
                    ["litres/kg"]: calculateLitresPerKg({
                        usableLitres: existingRow?.usableLitres || 0,
                        totalUsable: value.usable
                    }),
                    ["cost/litre"]: calculateCostPerLitre({
                        totalCost: value.cost,
                        usableLitres: existingRow?.usableLitres || 0
                    }),
                    ["ingredient"]:ingredients
                };
            });
        });
    }, [table]); // Only depend on 'table'


    useEffect(() => {
        if (!table || table.length === 0) return;

        const sa = table.map((row: RowType) => row["rawMaterials"]);

        if(Array.isArray(sa) && sa.every(value => typeof value === "string")) {
            const fetchIngredients = async () => {
                try {
                    const { data } = await getIngredientsByRawMaterialNames(sa);
                    setIngredients(data.map(ing => ing.name).join(",") );
                } catch (error) {
                    console.error("Error fetching ingredients:", error);
                }
            };

            fetchIngredients();
        }

    }, [table]);

    useEffect(() => {
        makeChanges();
    }, [makeChanges]);

    const handleSubmitData = async () => {
        const result = await createProductionDynamicData(production.id, {
            [foreign]: table,
            [tableKey]: editableData,
        });

        if (result) {
            setSavedSuccessfully(true);
        }
        console.log("Console log in submit", editableData);
    };

    const handleUpdate = (updatedRow: RowType) => {
        console.log("Consoling update", updatedRow);
        setEditableData((prevData) =>
            prevData.map((value) => {
                const correspondingTableItem = table.find((item) => item.id === value.id);
                const currentCost = correspondingTableItem ? correspondingTableItem.cost : value.cost; // Fallback to value.cost if not found in table
                return value.id === updatedRow.id
                    ? {
                        ...value,
                        usableLitres: updatedRow.usableLitres,
                        outputLitres: updatedRow.outputLitres,
                        productionLost: updatedRow.productionLost,
                        rawBrix: updatedRow.rawBrix,
                        ["litres/kg"]: calculateLitresPerKg({ usableLitres: updatedRow.usableLitres, totalUsable: value.totalUsable }),
                        ["cost/litre"]: calculateCostPerLitre({ totalCost: currentCost, usableLitres: updatedRow.usableLitres }),
                    }
                    : value;
            })
        );
    };

    return (
        <div className="p-4">
            <h1 className="font-bold text-xl mb-4">Populate And Edit Purchases</h1>

            {table && table.length>0 &&  <EditableTable
                onChange={setEditableData}
                columns={columns}
                data={editableData}
                onUpdate={handleUpdate}
                disableFields={() => ["avgCost", "avgWeightPerUOM", "usable","cost/litre"]}
            />}




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