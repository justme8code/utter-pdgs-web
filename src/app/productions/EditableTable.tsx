'use client';
import { useState } from "react";
import { Modal } from "@/app/components/Modal";
import { Trash } from "lucide-react";

export type RowType = { id: number, [key: string]: string | number };
export type ColumnType = { key: string, label: string, type?: string, options?: string[] };
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

const EditableTable = ({columns, data, onUpdate, onDelete, onAdd, onChange,disableFields }: EditableTableProps) => {
    console.log("Login data");
    console.log(data);
    const [tableData, setTableData] = useState(data);
    const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);



    const openModal = (row: RowType) => {
        setIsAdding(false); // Ensure we're not in add mode
        setSelectedRow({ ...row });
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        if (isAdding) {
            // If we are adding a new row, remove the last row
            const s = tableData.slice(0, tableData.length - 1);
            setTableData(s);
        }
        setSelectedRow(null);
        setIsAdding(false); // Reset the adding state
    };


    const handleModalChange = (field: string, value: string) => {
        setSelectedRow((prev) => (prev ? { ...prev, [field]: value } : null));
        onChange(tableData);
    };

    const saveChanges = () => {
        if (selectedRow) {
            const updatedData = tableData.map((row) =>
                row.id === selectedRow.id ? { ...selectedRow } : row
            );

            setTableData(updatedData);
            onChange(updatedData);
            if (onUpdate) {
                onUpdate(selectedRow);
            }
            setIsModalOpen(false);
            setIsModalOpen(false);

        }


    };

    const addNewRow = () => {
        setIsAdding(true); // Set to true for adding a new row
        const tableId = tableData ===undefined ? 0 : tableData.length;
        const newRow = {
            id: tableId + 1,
            product: "New Product",
            quantity: 0,
            material: "Unknown",
            status: "Pending",
        };
        setSelectedRow(newRow);

        setTableData((prev) => {
            if(prev){
                return [...prev, newRow]
            }
            return [newRow]
        });
        setIsModalOpen(true);
        onChange(tableData);
    };


    return (
        <div className="overflow-x-auto px-4">
            <button
                className="mb-4 bg-gray-100 ring-1 ring-gray-300  px-4 py-1 rounded-sm hover:bg-gray-300"
                onClick={() => addNewRow()}
            >
                + Add New Entry
            </button>

            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="border px-4 py-3 text-left font-semibold">
                            {col.label}
                        </th>
                    ))}
                    <th className="border px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {tableData && tableData.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition"
                        onClick={ ()=>openModal(row)}
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border px-4 py-3">
                                {row[col.key]}
                            </td>
                        ))}
                        <td className="border px-4 py-3 text-center">
                            <button
                                className="text-gray-500 hover:text-red-600 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTableData((prev) =>
                                        prev
                                            .filter((item) => item.id !== row.id) // Remove the selected row
                                            .map((item, index) => ({ ...item, id: index + 1 })) // Reset IDs sequentially
                                    );

                                    if (onDelete) {
                                        onDelete(row.id);
                                    }
                                }}
                            >
                                <Trash />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedRow && (
                    <div className="flex flex-col max-w-3xl p-4">
                        <h2 className="text-lg font-bold mb-4">Edit Row</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {columns.map((col) => {
                                const isDisabled = disableFields ? disableFields(selectedRow).includes(col.key) : false;

                                return (
                                    <label key={col.key} className="block text-sm font-medium">
                                        {col.label}:
                                        {col.type === "dropdown" ? (
                                            <select
                                                className="border w-full p-2 rounded mt-1"
                                                value={selectedRow[col.key]}
                                                onChange={(e) => handleModalChange(col.key, e.target.value)}
                                                disabled={isDisabled}
                                            >
                                                <option value={"select"}>

                                                </option>

                                                {col.options?.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={col.type || "text"}
                                                className="border w-full p-2 rounded mt-1"
                                                value={selectedRow[col.key] ?? ""}
                                                onChange={(e) => handleModalChange(col.key, e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        )}
                                    </label>
                                );
                            })}
                        </div>


                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        className="bg-gray-500 text-white px-4  p-1 rounded-sm hover:bg-gray-600"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="p-1 px-4 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition"
                                        onClick={saveChanges}
                                    >
                                        Save
                                    </button>
                                </div>

                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EditableTable;