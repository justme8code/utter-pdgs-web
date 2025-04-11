'use client';

import { useEffect, useState } from 'react';
import EditableTable, { ColumnType, DataType, RowType } from '../../components/production/EditableTable';
import { ExtendedProductionResponse } from '@/app/data_types';
import { createProductionDynamicData } from '@/app/actions/production';
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";
import {
    calAverageCostPerKgBasedOnTotalWeight,
    calAverageWeightPerUOMBasedOnTotalWeight,
    calculateUsableWeight
} from "@/app/production-computing-formulas";

const tableKey = 'populateEditPurchases';

export const PopulateEditPurchases = ({ production, columns }: { production: ExtendedProductionResponse, columns: ColumnType[] }) => {
    const [editableData, setEditableData] = useState<DataType[]>(production.dynamicData[tableKey]);
    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);
    const { updateTable } = usePopulatePurchasesStore();

    // Sync data with the store
    useEffect(() => {
        updateTable(editableData ?? production.dynamicData[tableKey]);
    }, [editableData, production.dynamicData, updateTable]);

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
            prevData.map((row) =>
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
    };

    // Handle row deletion
    const handleDelete = (id: number) => {
        if (id) {
            setEditableData((prevData) => (prevData ?? []).filter((row) => row.id !== id));
        }
    };



    return (
        <div className="p-4">
            <h1 className="font-bold text-xl mb-4">Populate And Edit Purchases</h1>

            <EditableTable
                onChange={(data) => {
                    setEditableData(data);
                    updateTable(data);
                }}
                columns={columns}
                data={editableData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                disableFields={() => ["avgCost", "avgWeightPerUOM", "usable"]}
            />

            {savedSuccessfully && <p className="text-green-500 mt-2">Update saved successfully!</p>}
        </div>
    );
};