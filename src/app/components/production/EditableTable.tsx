'use client';
import { useState} from "react";
import { Trash } from "lucide-react";
import {EditableTableModal} from "@/app/components/production/EditableTableModal";

export type RowType = { sn: number, id:number,[key: string]: string | number };
export type ColumnType = { key: string, label: string, type?: string, options?: string[], info?:boolean, donNotRender?: boolean,

}; // Updated ColumnType
export type DataType = { sn: number, [key: string]: string | number };

export interface EditableTableProps {
    columns: Array<ColumnType>;
    data: Array<DataType>;
    onUpdate?: (row: RowType) => void;
    onDelete?: (id: number) => void;
    onChange: (data:DataType[]) => void;
    onAdd?: (newRow: RowType) => void;
    disableFields?: (row: RowType) => string[];
    editable?: boolean;
    edit?:boolean;
}

const EditableTable = ({edit=true,columns, onAdd,data,  onDelete,  onChange,disableFields }: EditableTableProps) => {

    const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (row: RowType) => {
        setSelectedRow({...row});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (selectedRow && selectedRow.sn) {
            // Remove unsaved row
            const updatedData = data.filter((row) => row.sn !== 0);
            onChange(updatedData);
        }
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const saveChanges = () => {
        if (selectedRow) {
            if(selectedRow.sn > 0) {
                const updatedData = data.map((row) =>
                    row.sn === selectedRow.sn ? { ...selectedRow } : row
                );
                onChange(updatedData);
            } else {
                selectedRow.sn = data.length + 1;
                const updatedData = [...data, selectedRow];
                onChange(updatedData);
                if(onAdd){
                    onAdd(selectedRow);
                }
            }
        }
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const addNewRow = () => {
        // Reset selectedRow to ensure the modal starts with a clean state
        setSelectedRow({
            sn: 0, // Temporary ID for unsaved rows
            id: 0,
            rawMaterial: '',
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
            {edit && <button
                className="mb-4 bg-gray-100 ring-1 ring-gray-300 px-4 py-1 rounded-sm hover:bg-gray-300"
                onClick={addNewRow}
            >
                + Add New Entry
            </button>}

            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    {columns.map((col) => (
                        !col.donNotRender && ( // Only render if donNotRender is not true
                            <th key={col.key} className="border p-2 text-center font-semibold">
                                {col.label}
                            </th>
                        )
                    ))}
                    {edit && onDelete && <th className="border px-4 py-3 text-center font-semibold">Actions</th>}
                </tr>
                </thead>
                <tbody>
                {edit && data && data.map((row) => (
                    <tr
                        key={row.sn}
                        className="hover:bg-gray-50 transition"
                        onClick={() => openModal(row)}
                    >
                        {columns.map((col) => (
                            !col.donNotRender && ( // Only render if donNotRender is not true
                                <td key={col.key} className="border p-2 text-center">
                                    {row[col.key]}
                                </td>
                            )
                        ))}
                        {edit && onDelete && (
                            <td className="border px-4 py-3 text-center">
                                <button
                                    className="text-gray-500 hover:text-red-600 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedData = data.filter((item) => item.sn !== row.sn);
                                        onChange(updatedData);
                                        if (onDelete) {
                                            onDelete(row.sn);
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
                columns={columns.filter(col => !col.donNotRender)} // Filter columns passed to the modal
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