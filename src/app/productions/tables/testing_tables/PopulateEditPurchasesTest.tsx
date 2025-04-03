'use client';

import { useEffect, useState } from 'react';

import { ExtendedProductionResponse } from '@/app/data_types';
import { createProductionDynamicData } from '@/app/productions/actions';
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";
import {
    calAverageCostPerKgBasedOnTotalWeight,
    calAverageWeightPerUOMBasedOnTotalWeight,
    calculateUsableWeight
} from "@/app/production-computing-formulas";
import EditableTable, {ColumnType, RowType} from "@/app/productions/EditableTable";

const tableKey = 'populateEditPurchases';

export const PopulateEditPurchasesTest = ({ production, columns }: { production: ExtendedProductionResponse, columns: ColumnType[] }) => {
    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);
    const {table,updateTable} =usePopulatePurchasesStore();

    useEffect(() => {
        if (production.dynamicData && production.dynamicData[tableKey]) {

            updateTable(production.dynamicData[tableKey]);
        }
    }, [production.dynamicData, updateTable]);


    // Handle form submission
    const handleSubmitData = async () => {
        const result = await createProductionDynamicData<typeof table>(production.id, {
            [tableKey]: table, // Send the entire updated dynamicData
        });

        if (result) {
            setSavedSuccessfully(true);
        }
        console.log("Console log in submit", table);
    };

    // Handle row update
    const handleUpdate = (updatedRow: RowType) => {
        updateTable(
            table.map((row) =>
                row.id === updatedRow.id
                    ? {
                        ...row,
                        usable: calculateUsableWeight({ weight: row.weight, productionLostWeight: row.productionLost }),
                        avgCost: calAverageCostPerKgBasedOnTotalWeight({ cost: row.cost, weight: row.weight }),
                        avgWeightPerUOM: calAverageWeightPerUOMBasedOnTotalWeight({ weight: row.weight, qty: row.qty }),
                    }
                    : row
            )
        );

        console.log("running the use effect again ");
    };

    // Handle row deletion
    const handleDelete = (id: number) => {
        updateTable(table.filter((row) => row.id !== id));
    };

    // Handle adding new row
    const handleAdd = () => {
        const newRow = {
            id: 0, // Ensuring unique ID
            rawMaterials: 'New Raw Material',
            supplier: 'New Supplier',
            uom: 'kg',
            qty: 0,
            weight: 0,
            productionLost: 0,
            usable: 0,
            cost: 0,
            avgCost: 0,
            avgWeightPerUOM: 0,
        };

        console.log("Adding new table in add function" ,table);
        updateTable([...table, newRow]);
    };

    return (
        <div className="p-4">
            <h1 className="font-bold text-xl mb-4">Populate And Edit Purchases</h1>
            <EditableTable
                onChange={data => updateTable(data) }
                columns={columns}
                data={table}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAdd={handleAdd}
                disableFields={() => ["avgCost", "avgWeightPerUOM", "usable"]}
            />

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
