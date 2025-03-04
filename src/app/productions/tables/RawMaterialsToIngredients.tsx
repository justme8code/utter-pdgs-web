'use client';
import { useState } from "react";
import EditableTable, {ColumnType, RowType} from "../EditableTable";

export const RawMaterialsToIngredients = () => {

    const columns:ColumnType[] = [
        { key: "id", label: "S/N" },
        { key: "raw materials", label: "Raw Materials", type: "dropdown", options: ["Pineapple", "Banana", "Orange"] },
        { key: "total usable", label: "Total Usable (Kg)" },
        { key: "ingredient", label: "Ingredient" },
        { key: "output litres", label: "Output Litres" },
        { key: "production lost", label: "Production Litres Lost(kg)"},
        { key: "usable litres", label: "Usable Litres", type: "number" },
        { key: "litres/kg", label: "Litres/Kg", type: "number" },
        { key: "cost/litre", label: "Cost/Litre", type: "number" },
        { key: "raw brix", label: "Raw Brix"},
    ];


    const [tableData, setTableData] = useState([
        {
            id: 1,
            "raw materials": "Pineapple",
            "total usable": 450,
            ingredient: "Pineapple Pulp",
            "output litres": 400,
            "production lost": 50,
            "usable litres": 380,
            "litres/kg": 0.85,
            "cost/litre": 2.5,
            "raw brix": 12,
        },
        {
            id: 2,
            "raw materials": "Banana",
            "total usable": 280,
            ingredient: "Banana Puree",
            "output litres": 250,
            "production lost": 30,
            "usable litres": 240,
            "litres/kg": 0.86,
            "cost/litre": 2.8,
            "raw brix": 10,
        },
        {
            id: 3,
            "raw materials": "Orange",
            "total usable": 190,
            ingredient: "Orange Juice",
            "output litres": 170,
            "production lost": 20,
            "usable litres": 160,
            "litres/kg": 0.84,
            "cost/litre": 3,
            "raw brix": 11,
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
        const newRow = { id: Date.now(), "raw materials": "New Raw Material", "total usable": 0, ingredient: "New Ingredient", "output litres": 0, "production lost": 0, "usable litres": 0, "litres/kg": 0, "cost/litre": 0, "raw brix": 0 };
        setTableData(prevData => [...prevData, newRow]);
        console.log("Add New Entry Triggered");
    };

    return (
        <>
            <h1 className={"font-bold text-lg"}>Raw Materials To Ingredients</h1>
            <EditableTable
                columns={columns}
                data={tableData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAdd={handleAdd}
                disableFields={(row) => ["raw materials","ingredient","litres/kg","cost/litre","total usable"]}
            />
        </>
    );
};