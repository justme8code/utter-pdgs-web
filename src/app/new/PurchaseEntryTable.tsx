'use client';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Modal } from "@/app/components/Modal";
import { UpdatePurchaseEntry } from "@/app/new/UpdatePurchaseEntry";
import {useEffect, useState} from "react";
import { SamplePurchaseEntries } from "@/app/new/play-with-data";
import useSampleProductionStore from "@/app/store/sampleProductionStore";
import {Button} from "@/app/components/Button";
import useSelectedPurchaseEntriesStore from "@/app/store/selectedPurchaseEntriesStore";
import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";

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

const columns: TableColumn<SamplePurchaseEntries>[] = [
    {
        name: 'S/N',
        selector: (row, index) => index != undefined?index + 1:1,
        sortable: true,
    },
    {
        name:'ID',
        selector: row => row.id ?? 0,
        sortable: true,
    },
    {
        name: 'Raw Material',
        selector: row => row.rawMaterial.name,
    },
    {
        name: 'Supplier',
        selector: row => row.supplier.fullName??'',
    },
    {
        name: 'UoM',
        selector: row => row.uom,
    },
    {
        name: 'Qty',
        selector: row => row.qty.toFixed(2),
    },
    {
        name: 'Weight',
        selector: row => row.weight.toFixed(2),
    },
    {
        name: 'PLost',
        selector: row => row.productionLost.toFixed(2),
    },
    {
        name: 'Usable',
        selector: row => row.usable.toFixed(2),
    },
    {
        name: 'Cost',
        selector: row => row.cost,
        format: row => `₦ ${(row.cost || 0).toFixed(2)}`,
    },
    {
        name: 'Average Cost',
        selector: row => row.avgCost.toFixed(2),
    },
    {
        name: 'Avg w/UoM',
        selector: row => row.avgWeightPerUOM.toFixed(2),
    }
];


export default function PurchaseEntryTable() {
    const {production,updatePurchaseEntry,addPurchaseEntry} = useSampleProductionStore();
    const [selectedRow, setSelectedRow] = useState<SamplePurchaseEntries | null>(null);
    const {setPurchaseEntries}=useSelectedPurchaseEntriesStore();
    const [isEditMode, setIsEditMode] = useState(false);
    const {fetchRawMaterials} = useRawMaterialStore();
    const {fetchSuppliers} = useSupplierStore();

    const handleSelectedRowsChange = ({ selectedRows }:{selectedRows:SamplePurchaseEntries[]}) => {
        // You can set state or dispatch with something like Redux so we can use the retrieved data
        console.log('Selected Rows: ', selectedRows);
        // add selectedRows Id
        if(selectedRows && selectedRows.length > 0){
            const selectedIds = selectedRows.map(row => row.id !== undefined?row.id:0);
            if(selectedIds && selectedIds.length > 0) {
                setPurchaseEntries(selectedIds);
            }
        }
    };

    const handleAddRow = () => {
        const newRow: SamplePurchaseEntries = {
            rawMaterial: { id: 0, name: '',uom:'',ingredients:[] },
            supplier: { id: 0, fullName: '' },
            uom: '',
            qty: 0,
            weight: 0,
            productionLost: 0,
            usable: 0,
            cost: 0,
            avgCost: 0,
            avgWeightPerUOM: 0,
        };
        setSelectedRow(newRow);
        setIsEditMode(false); // Ensure we are in 'add' mode
    };

    const handleSaveNewRow = (newRowData: SamplePurchaseEntries) => {
        console.log('Saving new row:', newRowData);
        addPurchaseEntry({...newRowData,id:'New'+Date.now()});
        setSelectedRow(null);
    };

    const handleUpdateRow = (updatedRowData: SamplePurchaseEntries) => {
        console.log('Updating row:', updatedRowData);
        // check if updatedRowData.id is of type string or number
        const id:number| string = typeof updatedRowData.id === "string"?updatedRowData.id:Number(updatedRowData.id);
        if(id != undefined){
            updatePurchaseEntry(id,{...updatedRowData,id:id});
            setSelectedRow(null);
            setIsEditMode(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchRawMaterials();
            await fetchSuppliers();
        }
        fetchData();
    }, [fetchRawMaterials, fetchSuppliers]);

    return (
        <div className={"space-y-5"}>
            <Button label={"Add row"} onClick={handleAddRow} variant={"secondary"}/>

            <DataTable
                title={"Purchase Entries"}
                columns={columns}
                data={production.purchaseEntries??[]}
                onRowClicked={row => {
                    console.log('Row clicked:', row);
                    setSelectedRow(row);
                    setIsEditMode(true);
                }}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                customStyles={customStyles}
            />

            <Modal isOpen={!!selectedRow} onClose={() => setSelectedRow(null)}>
                <div className={"mb-5  border-b-1 border-gray-200 space-y-3 p-2"}>
                    <h1 className={"font-medium text-2xl"}>Purchase Entry</h1>
                    <h2 className={"text-gray-500 font-medium"}>Update/New entry</h2>
                </div>

                 <div className={"p-2"}>
                     {selectedRow && (
                         <UpdatePurchaseEntry
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