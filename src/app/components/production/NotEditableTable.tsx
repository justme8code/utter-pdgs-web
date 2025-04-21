'use client';
import { useState} from "react";

import { Trash } from "lucide-react";
import { ColumnType, DataType } from "./EditableTable";


export interface NotEditableTableProps {
    columns: Array<ColumnType>;
    data: Array<DataType>;
}

const NotEditableTable = ({columns, data }: NotEditableTableProps) => {

    return (
        <div className="overflow-x-auto px-4">
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="border p-2 text-center font-semibold">
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data && data.map((row) => (
                    <tr
                        key={row.sn}
                        className="hover:bg-gray-50 transition"
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border p-2 text-center">
                                {row[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    );
};

export default NotEditableTable;