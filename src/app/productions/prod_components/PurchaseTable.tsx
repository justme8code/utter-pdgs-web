
'use client';
import { useMemo } from 'react';
import DataTable, { ConditionalStyles, TableColumn } from 'react-data-table-component';
import { Purchase } from "@/app/types";
import { purchaseStyle } from "./purchaseStyle"; // Adjusted path
import { checkNan } from "@/app/utils/functions";
import { usePurchaseStore } from "@/app/store/purchaseStore";
import { ConversionModal } from "./conversion/ConversionModal"; // Adjusted path
import { useInitializePurchaseData } from "./hooks/useInitializePurchaseData"; // Adjusted path
import { ColorGuide } from "@/app/productions/[pid]/ColorGuide"; // Assuming path is correct
import { ShowFormPurchase } from "@/app/productions/[pid]/ShowFormPurchase"; // Assuming path is correct
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Shadcn Card
import { ShoppingCart, Info } from 'lucide-react'; // Icons

export function PurchaseTable() {
    const { purchases } = usePurchaseStore();
    useInitializePurchaseData();

    const getPurchaseColumns = (): TableColumn<Purchase>[] => [
        // ... your existing columns (no changes needed here)
        {
            name: 'S/N',
            selector: (row, index) => index !== undefined ? index + 1 : 1,
            sortable: true,
            width: '70px'
        },
        {
            name: 'ID',
            selector: row => row.id ?? 0,
            sortable: true,
            width: '80px'
        },
        {
            name:"Conversion",
            cell:(row) => {
                return <ConversionModal row={row}/> // Keep as is
            },
            width: '120px', // Adjust width as needed
            center: true,
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
            width: '80px',
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
            name: 'Usable (kg)', // Shortened for space
            selector: row => checkNan(row.usableWeight),
        },
        {
            name: 'Cost',
            selector: row => checkNan(row.cost),
            format: row => `₦ ${checkNan(row.cost)}`,
        },
        {
            name: 'Avg Cost', // Shortened
            selector: row => checkNan(row.avgCost),
        },
        {
            name: 'Avg W/UoM', // Shortened
            selector: row => checkNan(row.avgWeightPerUOM),
        },
    ];
    const columns: TableColumn<Purchase>[] = useMemo(() => getPurchaseColumns(), []);

    const conditionalRowStyles: ConditionalStyles<Purchase>[] = [
        {
            when: (row: Purchase): boolean => row.transferred ?? false,
            style: {
                backgroundColor: 'var(--color-green-100, #D1FAE5)', // Use CSS variables or direct hex
                color: 'var(--color-green-700, rgba(6,95,70,0.8))',
                '&:hover': {
                    backgroundColor: 'var(--color-green-200, #A7F3D0) !important',
                },
            },
        },
        // You can add more styles for other states if needed
    ];

    // DataTable custom styles:
    // Consider adjusting `purchaseStyle` to better match Shadcn's aesthetic if desired
    // For example, header background, font sizes, cell padding.
    // This is optional and depends on how much you want to tweak it.
    // Example of minimal adjustments to `purchaseStyle`:
    const customTableStyles = {
        ...purchaseStyle, // Your existing styles
        header: {
            style: {
                ...purchaseStyle.header?.style,
                backgroundColor: 'hsl(var(--muted))', // Shadcn muted background
                color: 'hsl(var(--muted-foreground))',
                fontSize: '13px',
                fontWeight: 600,
                minHeight: '48px',
            },
        },
        headCells: {
            style: {
                ...purchaseStyle.headCells?.style,
                paddingLeft: '12px',
                paddingRight: '12px',
                borderRight: '1px solid hsl(var(--border))',
            },
            sortIcon: { // If you want to style sort icons
              opacity: 0.5,
            },
        },
        rows: {
            style: {
                ...purchaseStyle.rows?.style,
                minHeight: '48px',
                '&:not(:last-of-type)': {
                  // borderBottomStyle: 'solid',
                  // borderBottomWidth: '1px',
                  // borderBottomColor: 'hsl(var(--border))',
                },
            },
            highlightOnHoverStyle: {
                ...purchaseStyle.rows?.highlightOnHoverStyle,
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
                transitionDuration: '0.15s',
                transitionProperty: 'background-color',
            },
        },
        cells: {
            style: {
                ...purchaseStyle.cells?.style,
                paddingLeft: '12px',
                paddingRight: '12px',
            },
        },
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6" />
                            Purchase Records
                        </CardTitle>
                        <CardDescription>
                            Manage and view raw material purchases for this production.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Ensure ShowFormPurchase and ColorGuide are styled or wrap them */}
                        <ShowFormPurchase />
                        <ColorGuide />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {purchases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <Info className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-lg font-medium text-muted-foreground">No Purchases Recorded Yet</p>
                        <p className="text-sm text-muted-foreground">{"Click \"Add Purchase\" to get started."}</p>
                    </div>
                ) : (
                    <DataTable
                        keyField="id" // Use 'id' if it's unique and present on all Purchase objects
                        columns={columns}
                        data={purchases}
                        customStyles={customTableStyles} // Use potentially adjusted styles
                        selectableRows
                        conditionalRowStyles={conditionalRowStyles}
                        pagination // Recommended for long lists
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 50, 100]}
                        highlightOnHover
                        // progressPending={isLoading} // If you have a loading state for purchases
                        // progressComponent={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    />
                )}
            </CardContent>
        </Card>
    );
}