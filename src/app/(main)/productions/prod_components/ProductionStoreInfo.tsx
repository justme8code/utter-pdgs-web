'use client';

import {useProductionStore} from "@/app/store/productionStore";
import {usePurchaseStore} from "@/app/store/purchaseStore";
import {Beaker, Info, Package, TrendingDown, TrendingUp} from "lucide-react"; // Icons
import {Badge} from "@/components/ui/badge";
import {InfoSectionCard} from "@/app/(main)/productions/[pid]/InfoSectionCard"; // For quantities

// Helper component for individual items to reduce repetition
const DataItem = ({label, value, unit, valueColor = "text-green-600 dark:text-green-400", extraInfo}: {
    label: string;
    value: string | number | undefined;
    unit?: string;
    valueColor?: string;
    extraInfo?: React.ReactNode;
}) => (
    <div className="p-3 bg-muted/50 rounded-md border space-y-1 text-xs hover:shadow-sm transition-shadow">
        <p className="font-medium text-muted-foreground truncate" title={label}>{label}:</p>
        <p className={`text-base sm:text-lg font-semibold font-mono ${valueColor} truncate`}
           title={`${value ?? 'N/A'}${unit ?? ''}`}>
            {value ?? 'N/A'}{unit}
        </p>
        {extraInfo && <div className="pt-1 text-xs text-muted-foreground">{extraInfo}</div>}
    </div>
);


export const ProductionStoreInfo = () => { // Renamed component for clarity
    const {selectedProduction} = useProductionStore();
    const {purchases} = usePurchaseStore();

    const ingredientStores = selectedProduction?.productionStore?.ingredientStores || [];
    const hasIngredients = ingredientStores.length > 0;
    const hasPurchases = purchases.length > 0;

    // If there's no data at all, perhaps show a different message or nothing
    if (!selectedProduction && !hasPurchases) {
        return (
            <div className="p-4 text-center text-muted-foreground italic">
                No production selected or no data to display.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1"> {/* Main layout for the two cards */}
            {selectedProduction && (
                <InfoSectionCard
                    title="Ingredient Stock"
                    description="Remaining usable quantities of ingredients."
                    icon={Beaker}
                    gridCols="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" // Adjust based on expected number of items
                >
                    {hasIngredients ? (
                        ingredientStores.filter(value => value.usableLitresLeft>0).map((value, index) => (
                            <DataItem
                                key={value.ingredient.id || index}
                                label={value.ingredient.name}
                                value={value.usableLitresLeft?.toFixed(2)}
                                unit="L"
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-sm text-muted-foreground py-4">
                            <Info className="inline-block mr-1 h-4 w-4"/> No ingredient stock data for this production.
                        </p>
                    )}
                </InfoSectionCard>
            )}

            <InfoSectionCard
                title="Raw Material Usage"
                description="Quantities of raw materials and their usage."
                icon={Package}
                gridCols="grid-cols-1 sm:grid-cols-2" // Raw material cards are a bit more dense
            >
                {hasPurchases ? (
                    purchases.map((value, index) => (
                        <div key={value.id || index}
                             className="p-3 bg-muted/50 rounded-md border space-y-1.5 text-xs hover:shadow-sm transition-shadow">
                            <p className="font-semibold text-foreground truncate"
                               title={value.rawMaterial?.name ?? "Unknown Material"}>
                                {value.rawMaterial?.name ?? "Unknown Material"}
                                {value.rawMaterial?.uom && <span
                                    className="text-xs text-muted-foreground ml-1">({value.rawMaterial.uom})</span>}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Available:</span>
                                <Badge variant="secondary"
                                       className="font-mono text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/30">
                                    <TrendingUp className="h-3 w-3 mr-1"/>

                                    {parseFloat(String(isNaN(value.purchaseUsage?.usableWeightLeft ?? 0.0) ? 0.0 : value.purchaseUsage?.usableWeightLeft)).toFixed(2) ?? 'N/A'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Used:</span>
                                <Badge variant="outline"
                                       className="font-mono text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10 border-red-500/20">
                                    <TrendingDown className="h-3 w-3 mr-1"/>
                                    
                                    {parseFloat(String(isNaN(value.purchaseUsage?.totalKgUsed ?? 0.0) ? 0.0 : value.purchaseUsage?.totalKgUsed)).toFixed(2) ?? 'N/A'}
                                </Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-sm text-muted-foreground py-4">
                        <Info className="inline-block mr-1 h-4 w-4"/> No raw material purchase data available.
                    </p>
                )}
            </InfoSectionCard>
        </div>
    );
};