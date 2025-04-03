'use client';
import {useEffect, useState} from "react";
import { Modal } from "@/app/components/Modal";
import { Trash } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';


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

const EditableTable = ({columns, data, onUpdate, onDelete, onAdd, onChange,disableFields }: EditableTableProps) => {

    const [tableData, setTableData] = useState(data);
    const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const openModal = (row: RowType) => {
        setIsAdding(false);
        setSelectedRow({ ...row });
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        /*if (isAdding) {
            // If we are adding a new row, remove the last row
            const s = tableData.slice(0, tableData.length - 1);
            setTableData(s);
        }
        setSelectedRow(null);
        setIsAdding(false);*/
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
        setIsAdding(true);
        const tableId = tableData ===undefined ? 0 : tableData.length;
        const newRow = {
            id: tableId+1, // Ensuring unique ID
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
            {onAdd &&  <button
                className="mb-4 bg-gray-100 ring-1 ring-gray-300  px-4 py-1 rounded-sm hover:bg-gray-300"
                onClick={() => addNewRow()}
            >
                + Add New Entry
            </button>}

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
                {tableData && tableData.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition"
                        onClick={ ()=>openModal(row)}
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border p-2 text-center">
                                {col.info ? (
                                    <Tooltip.Provider>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <div>
                                                    Auto
                                                    {typeof row[col.key] === "string"
                                                        && (row[col.key] as string).split(",").map((value, index) => (
                                                            <div key={index}></div>
                                                        ))}
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content className="bg-gray-800 text-white text-sm px-2 py-1 rounded-md shadow-lg">
                                                    {row[col.key]}
                                                    <Tooltip.Arrow className="fill-gray-800" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider>
                                ) : (
                                    row[col.key]
                                )}
                            </td>
                        ))}
                        {onDelete && <td className="border px-4 py-3 text-center">
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
                        </td>}
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
                                        {
                                            <div className={"flex"}>
                                                <p>{col.label}:</p>
                                                {isDisabled && <p>(Auto)</p>}
                                            </div>
                                        }
                                        {col.type === "dropdown" ? (
                                            <select

                                                title={isDisabled ? "Auto" : ""}
                                                className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none  w-full p-2 rounded mt-1"
                                                value={selectedRow[col.key] || ""}
                                                onChange={(e) => handleModalChange(col.key, e.target.value)}
                                                disabled={isDisabled}
                                            >

                                                <option value="" disabled>Select your option</option>
                                                {col.options?.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>

                                        ) :(
                                            <input
                                                type={col.type || "text"}
                                                title={isDisabled ? "Auto" : ""}
                                                className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none  w-full p-2 rounded mt-1"
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