import {ColumnType, DataType} from "@/app/productions/EditableTable";
import {useState} from "react";

interface UnEditableTableProps {
    columns: Array<ColumnType>;
    data: Array<DataType>;
}
export const UnEditableTable = ({columns, data}:UnEditableTableProps) => {
    const [tableData] = useState(data);
    return (
        <>

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
                {tableData.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition"
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="border px-4 py-3">
                                {row[col.key]}
                            </td>
                        ))}

                    </tr>
                ))}
                </tbody>
            </table>

        </>
    );
};