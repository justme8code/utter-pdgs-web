'use client';
import {useMemo} from 'react';
import DataTable, {ConditionalStyles} from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';
import {Purchase} from "@/app/types";
import {purchaseStyle} from "@/app/productions/component/purchaseStyle";
import {checkNan} from "@/app/utils/functions";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {ConversionModal} from "@/app/productions/component/conversion/ConversionModal";
import {useInitializePurchaseData} from "@/app/productions/component/hooks/useInitializePurchaseData";
import {ColorGuide} from "@/app/productions/[pid]/ColorGuide";
import {ShowFormPurchase} from "@/app/productions/[pid]/ShowFormPurchase";

export function PurchaseTable() {

    const {purchases} = usePurchaseStore()


    useInitializePurchaseData();
    const getPurchaseColumns = (): TableColumn<Purchase>[] => [
        {
            name: 'S/N',
            selector: (row, index) => index !== undefined ? index + 1 : 1,
            sortable: true,
        },
        {
            name: 'ID',
            selector: row => row.id ?? 0,
            sortable: true,
        },
        {
            name:"Conversion",
            cell:(row) => {
               return <ConversionModal row={row}/>
            }
        },
        {
            name: 'Raw Material',
            selector: row => row.rawMaterial?.name ?? "",
        },
        {
            name: 'Supplier',
            selector: row => row.supplier?.fullName ?? '',
        },
        {
            name: 'UoM',
            selector: row => row.rawMaterial?.uom ?? '',
        },
        {
            name: 'UoMQty',
            selector: row => checkNan(row.uomQty),
        },
        {
            name: 'Weight (kg)',
            selector: row => checkNan(row.weight),
        },
        {
            name: 'PLost',
            selector: row => checkNan(row.productionLostWeight),
        },
        {
            name: 'Usable Weight (kg)',
            selector: row => checkNan(row.usableWeight),

        },
        {
            name: 'Cost',
            selector: row => checkNan(row.cost),
            format: row => `₦ ${checkNan(row.cost)}`,
        },
        {
            name: 'Average Cost',
            selector: row => checkNan(row.avgCost),
        },
        {
            name: 'Avg w/UoM',
            selector: row => checkNan(row.avgWeightPerUOM),
        },
    ];
    const columns: TableColumn<Purchase>[] = useMemo(() => getPurchaseColumns(), []);


    const conditionalRowStyles: ConditionalStyles<Purchase>[] = [
        {
            when: (row: Purchase) => row.transferred,
            style: {
                backgroundColor: '#D1FAE5',
                color: 'rgba(6,95,70,0.58)'
            },
        },
    ];


    return (
        <div className={"space-y-5"}>
            <h1 className={"text-xl font-medium"}>Purchases</h1>

            <div className={"flex justify-between items-center"}>
                <ShowFormPurchase/>
                <ColorGuide/>
            </div>

            <DataTable
                keyField={`ID`}
                columns={columns}
                data={purchases}
                customStyles={purchaseStyle}
                selectableRows
                conditionalRowStyles={conditionalRowStyles}
            />
        </div>
    );
}