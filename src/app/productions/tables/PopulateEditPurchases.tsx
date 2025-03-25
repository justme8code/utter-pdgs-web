'use client';

import {useEffect, useState} from 'react';
import EditableTable, { ColumnType, DataType, RowType } from '../EditableTable';
import { ExtendedProductionResponse } from '@/app/data_types';
import { createProductionDynamicData } from '@/app/productions/actions';
import usePopulatePurchasesStore from "@/app/store/usePopulatePurchasesTable";

const tableKey = 'populateEditPurchases';

export const PopulateEditPurchases = ({ production, columns }: { production: ExtendedProductionResponse, columns: ColumnType[] }) => {
    const [editable, setEditable] = useState<boolean>(false);
    const [editableData, setEditableData] = useState<DataType[]>(production.dynamicData[tableKey]);
    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);
    const {updateTable} = usePopulatePurchasesStore();

    useEffect(() => {
        updateTable(editableData);
    },[editableData, updateTable])

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

    // Handle adding new row
    const handleAdd = () => {
        const newRow = {
            id: 0,
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

        setEditableData((prevData) => [...prevData, newRow]);
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
                onAdd={handleAdd}
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
