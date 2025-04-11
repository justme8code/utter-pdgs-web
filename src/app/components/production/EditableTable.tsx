'use client';
import { useState} from "react";

import { Trash } from "lucide-react";

import {EditableTableModal} from "@/app/components/production/EditableTableModal";


export type RowType = { id: number, [key: string]: string | number };
export type ColumnType = { key: string, label: string, type?: string, options?: string[], info?:boolean};
export type DataType = { id: number, [key: string]: string | number };

export interface EditableTableProps {
    columns: Array<ColumnType>;
    data: Array<DataType>;
    onUpdate?: (row: RowType) => void;
    onDelete?: (id: number) => void;
    onChange: (data:DataType[]) => void;
    onAdd?: (newRow: RowType) => void;
    disableFields?: (row: RowType) => string[];
    editable?: boolean;
}

const EditableTable = ({columns, data, onUpdate, onDelete,  onChange,disableFields }: EditableTableProps) => {

    const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (row: RowType) => {
        setSelectedRow({...row});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (selectedRow) {
            // Remove unsaved row
            const updatedData = data.filter((row) => row.id !== 0);
            onChange(updatedData);
        }

        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const saveChanges = () => {
        if (selectedRow) {
            if(selectedRow.id > 0) {
                const updatedData = data.map((row) =>
                    row.id === selectedRow.id ? { ...selectedRow } : row
                );
                onChange(updatedData);

            }else{
                selectedRow.id = data.length+1
                const updatedData = [...data, selectedRow];
                onChange(updatedData);

            }

        }

        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const addNewRow = () => {
        // Reset selectedRow to ensure the modal starts with a clean state
        setSelectedRow({
            id: 0, // Temporary ID for unsaved rows
            rawMaterials: '',
            supplier: '',
            uom: 'kg',
            qty: 0,
            weight: 0,
            productionLost: 0,
            usable: 0,
            cost: 0,
            avgCost: 0,
            avgWeightPerUOM: 0,
        });
        setIsModalOpen(true);
    };




    return (
        <div className="overflow-x-auto px-4">

                <button
                    className="mb-4 bg-gray-100 ring-1 ring-gray-300 px-4 py-1 rounded-sm hover:bg-gray-300"
                    onClick={addNewRow}
                >
                    + Add New Entry
                </button>


            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="border p-2 text-center font-semibold">
                            {col.label}
                        </th>
                    ))}
                    {onDelete && <th className="border px-4 py-3 text-center font-semibold">Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition"
                        onClick={() => openModal(row)}
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border p-2 text-center">
                                {row[col.key]}
                            </td>
                        ))}
                        {onDelete && (
                            <td className="border px-4 py-3 text-center">
                                <button
                                    className="text-gray-500 hover:text-red-600 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedData = data.filter((item) => item.id !== row.id);
                                        onChange(updatedData);
                                        if (onDelete) {
                                            onDelete(row.id);
                                        }
                                    }}
                                >
                                    <Trash />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            <EditableTableModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                selectedRow={selectedRow}
                columns={columns}
                handleModalChange={(field, value) => {
                    setSelectedRow((prev) => (prev ? { ...prev, [field]: value } : null));
                }}
                saveChanges={saveChanges}
                disableFields={disableFields}
            />
        </div>
    );
};

export default EditableTable;