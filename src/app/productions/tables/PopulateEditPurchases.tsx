'use client';
import { useState } from "react";
import EditableTable, {ColumnType, RowType} from "../EditableTable";

export const PopulateEditPurchases = () => {

    const columns:ColumnType[] = [
        { key: "id", label: "S/N" },
        { key: "raw materials", label: "Raw Materials", type: "dropdown", options: ["Pineapple", "Banana", "Orange"] },
        { key: "supplier", label: "Supplier", type: "dropdown", options: ["Pineapple", "Banana", "Orange"] },
        { key: "uom", label: "UoM" },
        { key: "qty", label: "Qty", type: "number" },
        { key: "weight", label: "Weight(Kg)" },
        { key: "production lost", label: "PL(kg)", type: "dropdown", options: ["Pending", "In Progress", "Completed"] },
        { key: "usable", label: "Usable Weight(Kg)", type: "number" },
        { key: "cost", label: "Cost", type: "number" },
        { key: "avg cost", label: "Avg Cost(Kg)", type: "number" },
        { key: "avg weight per UOM", label: "Avg Weight per UOM", type: "number" },
      ];


    const [tableData, setTableData] = useState([
        {
            id: 1,
            "raw materials": "Pineapple",
            supplier: "Pineapple",
            uom: "kg",
            qty: 500,
            weight: 450,
            "production lost": "Pending",
            usable: 430,
            cost: 1000,
            "avg cost": 2.5,
            "avg weight per UOM": 0.9,
        },
        {
            id: 2,
            "raw materials": "Banana",
            supplier: "Banana",
            uom: "kg",
            qty: 300,
            weight: 280,
            "production lost": "Completed",
            usable: 270,
            cost: 800,
            "avg cost": 2.8,
            "avg weight per UOM": 0.93,
        },
        {
            id: 3,
            "raw materials": "Orange",
            supplier: "Orange",
            uom: "kg",
            qty: 200,
            weight: 190,
            "production lost": "In Progress",
            usable: 180,
            cost: 600,
            "avg cost": 3,
            "avg weight per UOM": 0.95,
        },
    ]);



    const handleUpdate = (updatedRow: RowType) => {
        setTableData(prevData => prevData
            .map(row => row.id === updatedRow.id ? {...row, ...updatedRow} : row));
    }

    const handleDelete = (id: number) => {
        setTableData(prevData => prevData.filter(row => row.id !== id));
        console.log("Deleted ID:", id);
    };

    const handleAdd = () => {
        const newRow = { id: Date.now(), "raw materials": "New Raw Material", supplier: "New Supplier", uom: "kg", qty: 0, weight: 0, "production lost": "Pending", usable: 0, cost: 0, "avg cost": 0, "avg weight per UOM": 0 };
        setTableData(prevData => [...prevData, newRow]);
        console.log("Add New Entry Triggered");
    };

    return (
        <>
            <h1 className={"font-bold text-lg"}>Populate And Edit Purchases</h1>
            <EditableTable
                columns={columns}
                data={tableData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />
        </>
    );
};