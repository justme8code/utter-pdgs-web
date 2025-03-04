import { useState } from "react";

export type RowType = { id: number, [key: string]: string | number };
export type ColumnType = { key: string, label: string, type?: string, options?: string[] };
export type DataType = { id: number, [key: string]: string | number };

export interface EditableTableProps {
    columns: Array<ColumnType>;
    data: Array<DataType>;
    onUpdate?: (row: RowType) => void;
    onDelete?: (id: number) => void;
    onAdd?: (newRow: RowType) => void;
    disableFields?: (row: RowType) => string[]; // Function to determine which fields should be disabled
}

const EditableTable = ({ columns, data, onUpdate, onDelete, onAdd, disableFields }: EditableTableProps) => {
    const [tableData, setTableData] = useState(data);
    const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open modal for editing
    const openModal = (row: RowType) => {
        setSelectedRow({ ...row });
        setIsModalOpen(true);
    };

    // Handle input changes in modal
    const handleModalChange = (field: string, value: string) => {
        setSelectedRow((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    // Save changes and update state
    const saveChanges = () => {
        if (selectedRow) {
            const updatedData = tableData.map((row) =>
                row.id === selectedRow.id ? { ...selectedRow } : row
            );
            setTableData(updatedData);
            onUpdate && onUpdate(selectedRow);
            setIsModalOpen(false);
        }
    };

    // Add new row
    const addNewRow = () => {
        const newRow = {
            id: tableData.length + 1,
            product: "New Product",
            quantity: 0,
            material: "Unknown",
            status: "Pending",
        };
        setTableData((prev) => [...prev, newRow]);
        onAdd && onAdd(newRow);
    };

    return (
        <div className="overflow-x-auto">
            <button
                className="mb-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={addNewRow}
            >
                + Add New Entry
            </button>

            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="border px-4 py-2">{col.label}</th>
                    ))}
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openModal(row)}
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border px-4 py-2">
                                {row[col.key]}
                            </td>
                        ))}
                        <td className="border px-4 py-2">
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTableData((prev) => prev.filter((item) => item.id !== row.id));
                                    onDelete && onDelete(row.id);
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <h2 className="text-lg font-bold mb-4">Edit Row</h2>

                        <div className={"flex flex-wrap gap-4"}>
                            {columns.map((col) => {
                                const isDisabled = disableFields ? disableFields(selectedRow).includes(col.key) : false;

                                return (
                                    <label key={col.key} className="block mb-2">
                                        {col.label}:
                                        {col.type === "dropdown" ? (
                                            <select
                                                className="border w-full p-2 rounded"
                                                value={selectedRow ? selectedRow[col.key] : ""}
                                                onChange={(e) => handleModalChange(col.key, e.target.value)}
                                                disabled={isDisabled}
                                            >
                                                {col.options && col.options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={col.type || "text"}
                                                className="border w-full p-2 rounded"
                                                value={selectedRow && selectedRow[col.key] !== undefined ? selectedRow[col.key] : ""}
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
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={saveChanges}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableTable;
