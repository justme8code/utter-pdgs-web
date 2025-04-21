'use client';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Modal } from "@/app/components/Modal";
import {useEffect, useState} from "react";
import {SampleMaterialToIngredients} from "@/app/new/play-with-data";
import {UpdateMaterialToIngredient} from "@/app/new/UpdateMaterialToIngredient";
import useSampleProductionStore from "@/app/store/sampleProductionStore";
import {useIngredientStore} from "@/app/store/ingredientStore";

const customStyles = {
    header: {
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#626567',
            backgroundColor: '#fafafa',

        },
    },
    rows: {
        style: {
            fontSize: '16px',
            color: '#ffffff',
            '&:hover': {
                backgroundColor: '#E2E8F0',
            },

        },
    },
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#303030',
            backgroundColor: '#f3f3f3',
        },
    },
    cells: {
        style: {
            fontSize: '16px',
            color: '#4A5568',

        },
    },
};


const columns: TableColumn<SampleMaterialToIngredients>[] = [
    {
        name: 'S/N',
        selector: (row, index) => (index != undefined ? index + 1 : 1),
        sortable: true,
    },
    {
        name: 'Purchase ID',
        selector: row => row.purchaseEntry.id,
        sortable: true,
    },
    {
        name: 'Raw Material',
        selector: row => row.purchaseEntry.rawMaterial.name,
        sortable: true,
    },
    {
        name: 'Total Usable',
        selector: row => row.totalUsable,
        sortable: true,
        format: row => row.totalUsable.toFixed(2), // Ensures one decimal place
    },
    {
        name: 'Production Litres Lost',
        selector: row => row.productionLost,
        sortable: true,
        format: row => row.productionLost.toFixed(2), // Ensures one decimal place
    },
    {
        name: 'Batch',
        selector: row => row.batch,
        sortable: true,
    },
    {
        name: 'Litres/Kg',
        selector: row => row.litresPerKg,
        sortable: true,
        format: row => row.litresPerKg.toFixed(2), // Ensures one decimal place
    },
    {
        name: 'Cost/Litre',
        selector: row => row.costPerLitre,
        sortable: true,
        format: row => `$${row.costPerLitre.toFixed(2)}`, // Ensures two decimal places
    },
    {
        name: 'Ingredients',
        selector: row => row.ingredients.map(ingredient => ingredient.name).join(', '),
    },
];




export default function MaterialToIngredientTable() {
    const {production,updateMaterialToIngredient,addMaterialToIngredient} = useSampleProductionStore();
    const [selectedRow, setSelectedRow] = useState<SampleMaterialToIngredients | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const {ingredients,fetchIngredients} = useIngredientStore();

    useEffect(() => {
        if(!ingredients || ingredients.length === 0) {
            fetchIngredients();
        }
    }, [fetchIngredients, ingredients]);

    const handleSaveNewRow = (newRowData: SampleMaterialToIngredients) => {
        console.log('Saving new row:', newRowData);
        addMaterialToIngredient({...newRowData,id:Date.now()});
        setSelectedRow(null);
        setSelectedRow(null);
    };

    const handleUpdateRow = (updatedRowData: SampleMaterialToIngredients) => {
        console.log('Updating row:', updatedRowData);
        updateMaterialToIngredient(Number(updatedRowData.id),{...updatedRowData,id:Number(updatedRowData.id)});
        setSelectedRow(null);
        setIsEditMode(false);
    };

    const handleAddBatch = () => {
        // Find the first purchase entry that is not yet assigned to a materialToIngredient
        const purchaseEntry = production.purchaseEntries?.find(entry =>
            !production.materialToIngredients?.some(material => material.purchaseEntry.id === entry.id)
        );

        if (purchaseEntry) {
            console.log('Found purchase entry:', purchaseEntry);

            // Create a new SampleMaterialToIngredients object
            const newMaterialToIngredient: SampleMaterialToIngredients = {
                purchaseEntry: {
                    id: purchaseEntry.id,
                    rawMaterial: purchaseEntry.rawMaterial,
                },
                totalUsable: purchaseEntry.usable,
                productionLost: purchaseEntry.productionLost,
                batch: 0, // Default value, update as needed
                litresPerKg: 0.0, // Default value, update as needed
                costPerLitre: 0.0, // Default value, update as needed
                ingredients: ingredients.filter(ingredient =>
                    ingredient.rawMaterials && ingredient.rawMaterials.some(rawMaterial => rawMaterial.id === purchaseEntry.rawMaterial.id)
                ),
            };

            console.log('New MaterialToIngredient:', newMaterialToIngredient);

            // Add the new object to the materialToIngredients list
            addMaterialToIngredient({ ...newMaterialToIngredient });
        } else {
            console.log('No unassigned purchase entry found.');
        }
    };

    return (
        <div>
            <button onClick={handleAddBatch}>
                Add batch
            </button>
            <DataTable
                columns={columns}
                data={production.materialToIngredients??[]}
                onRowClicked={row => {
                    console.log('Row clicked:', row);
                    setSelectedRow(row);
                    setIsEditMode(true);
                }}
                customStyles={customStyles}
            />

            <Modal isOpen={!!selectedRow} onClose={() => setSelectedRow(null)}>
                <div className={"mb-5  border-b-1 border-gray-200 space-y-3 p-2"}>
                    <h1 className={"font-medium text-2xl"}>Raw Materials To Ingredient</h1>
                    <h2 className={"text-gray-500 font-medium"}>Update row</h2>
                </div>
                 <div className={"p-2"}>
                     {selectedRow && (
                         <UpdateMaterialToIngredient
                             data={selectedRow}
                             onSave={data1 => {
                                 handleSaveNewRow(data1);
                             }}
                             isEditMode={isEditMode}
                             onChange={(updatedData) => {
                                 console.log('Data from modal:', updatedData);
                                 setSelectedRow(updatedData);
                             }}
                             onUpdate={data1 => handleUpdateRow(data1)}
                         />
                     )}
                 </div>

            </Modal>
        </div>
    );
}