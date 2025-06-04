'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    InventoryDashboardData,
    LowStockIngredient,
    LowStockRawMaterial,
    IngredientInStore,
    RawMaterialInStore
} from "@/app/types";
import { useEffect, useState } from "react";
import { fetchInventoryDashboardData } from "@/api/dashboardActions";
import {
    AlertTriangle,

    Package,
    Boxes,
    FlaskConical,
    Sigma,
    BellRing,
    ListTree,
    FileX2,

    CheckCircle2,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to determine text and icon color based on stock level
const getStockLevelStyle = (value: number, unit: string = "L") => {
    if (value <= 0) {
        return {
            textClass: "text-destructive dark:text-red-400",
            iconColor: "text-destructive dark:text-red-400",
            icon: <AlertTriangle className="h-4 w-4" />,
            badgeVariant: "destructive" as const,
            label: `${value}${unit} - Critical`,
        };
    }
    if (value <= 5) {
        return {
            textClass: "text-red-600 dark:text-red-400",
            iconColor: "text-red-600 dark:text-red-400",
            icon: <AlertTriangle className="h-4 w-4" />,
            badgeVariant: "destructive" as const,
            label: `${value}${unit} - Very Low`,
        };
    }
    if (value <= 15) {
        return {
            textClass: "text-yellow-600 dark:text-yellow-400",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            icon: <AlertTriangle className="h-4 w-4" />,
            badgeVariant: "secondary" as const,
            label: `${value}${unit} - Low`,
        };
    }
    return {
        textClass: "text-green-600 dark:text-green-400",
        iconColor: "text-green-600 dark:text-green-400",
        icon: <CheckCircle2 className="h-4 w-4" />,
        badgeVariant: "default" as const,
        label: `${value}${unit} - Good`,
    };
};

const InfoCardSkeleton = ({ itemCount = 2 }: { itemCount?: number }) => (
    <Card className="shadow-md border-border/60">
        <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-sm" />
                <Skeleton className="h-6 w-2/5" />
            </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
            {[...Array(itemCount)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                    <Skeleton className="h-5 w-1/4" />
                </div>
            ))}
            {itemCount === 0 && <Skeleton className="h-4 w-full" />}
        </CardContent>
    </Card>
);


const InventoryDashboard = () => {
    const [data, setData] = useState<InventoryDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                const { data: fetchedData, status, error: apiError } = await fetchInventoryDashboardData(); // Assuming this matches your API wrapper
                if (status && fetchedData) {
                    setData(fetchedData as InventoryDashboardData); // Added 'as' for clarity if fetch is generic
                } else {
                    setError(apiError.message || "Failed to fetch inventory data. Server might be busy or no data available.");
                    console.error("API Error: Inventory fetch failed", apiError);
                }
            } catch (err) {
                setError("An unexpected error occurred while loading inventory information.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
                <InfoCardSkeleton itemCount={2} />
                <InfoCardSkeleton itemCount={4} />
                <InfoCardSkeleton itemCount={3} />
                <InfoCardSkeleton itemCount={3} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[300px] p-4 md:p-6">
                <Card className="w-full max-w-lg shadow-lg border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-7 w-7 text-destructive" />
                            <CardTitle className="text-xl text-destructive">Loading Error</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive/90">{error}</p>
                        <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page or contact support if the issue persists.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || (data.ingredientTotalLitres === 0 && data.rawMaterialTotalLitres === 0 && data.lowStockIngredients.length === 0 && data.lowStockRawMaterials.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[300px] p-4 md:p-6">
                <Card className="w-full max-w-md shadow-md border-border/60">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <Package className="h-7 w-7 text-muted-foreground" />
                            <CardTitle className="text-xl">Inventory Status</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center py-10">
                        <FileX2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No Inventory Data</p>
                        <p className="text-sm text-muted-foreground/80 mt-1">
                            {"There's no inventory information to display at the moment."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const {
        ingredientTotalLitres,
        rawMaterialTotalLitres,
        lowStockIngredients,
        lowStockRawMaterials,
        ingredientBreakdown,
        rawMaterialBreakdown,
    } = data;

    const renderLowStockList = (
        items: (LowStockIngredient | LowStockRawMaterial)[], // Corrected type
        itemType: "ingredient" | "rawMaterial"
    ) => {
        if (!items.length) {
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 px-3 border border-dashed rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>All {itemType === "ingredient" ? "ingredients" : "raw materials"} are well-stocked.</span>
                </div>
            );
        }
        return (
            <ul className="space-y-2">
                {items.map((item, index) => {
                    let stockLevel: number;
                    let itemName: string;
                    let currentItemId: number | undefined;

                    if (itemType === "ingredient") {
                        const ingItem = item as LowStockIngredient;
                        stockLevel = ingItem.usableLitresLeft;
                        itemName = ingItem.ingredient.name;
                        currentItemId = ingItem.id;
                    } else { // itemType === "rawMaterial"
                        const rmItem = item as LowStockRawMaterial;
                        stockLevel = rmItem.usableQtyLeft ?? 0;
                        itemName = rmItem.rawMaterial?.name || "Unknown Item";
                        currentItemId = rmItem.id;
                    }
                    const style = getStockLevelStyle(stockLevel);

                    return (
                        // `currentItemId || index` is robust here because `id` is number | undefined
                        <li key={currentItemId || index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className={cn("flex-shrink-0", style.iconColor)}>{style.icon}</span>
                                <span className="font-medium">{itemName}</span>
                            </div>
                            <Badge variant={style.badgeVariant} className="text-xs">
                                {style.label}
                            </Badge>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderBreakdownList = (
        items: (IngredientInStore | RawMaterialInStore)[], // Corrected type
        itemType: "ingredient" | "rawMaterial"
    ) => {
        if (!items.length) {
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 px-3 border border-dashed rounded-md">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span>No breakdown data available for {itemType === "ingredient" ? "ingredients" : "raw materials"}.</span>
                </div>
            );
        }
        return (
            <ul className="space-y-1.5">
                {items.map((item, index) => { // Key is now just index
                    let stockLevel: number;
                    let itemName: string;

                    if (itemType === "ingredient") {
                        const ingStoreItem = item as IngredientInStore;
                        stockLevel = ingStoreItem.totalLitres;
                        itemName = ingStoreItem.ingredientName;
                    } else { // itemType === "rawMaterial"
                        const rmStoreItem = item as RawMaterialInStore;
                        stockLevel = rmStoreItem.totalQty;
                        itemName = rmStoreItem.rawMaterialName;
                    }
                    const style = getStockLevelStyle(stockLevel);

                    return (
                        // Corrected: `IngredientInStore` and `RawMaterialInStore` do not have an `id`.
                        // So, `index` is the correct and only reliable key here.
                        <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <span className="font-medium">{itemName}</span>
                            <span className={cn("font-semibold", style.textClass)}>{stockLevel}L</span>
                        </li>
                    );
                })}
            </ul>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
            {/* Totals Card */}
            <Card className="shadow-md border-border/60 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                        <Sigma className="h-6 w-6 text-primary" />
                        <CardTitle className="text-xl font-semibold tracking-tight">Inventory Totals</CardTitle>
                    </div>
                    <CardDescription>Overall sum of available stock.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FlaskConical className="h-6 w-6 text-blue-500" />
                            <span className="font-medium">Total Ingredient Stock</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {ingredientTotalLitres.toLocaleString()} L
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Boxes className="h-6 w-6 text-purple-500" />
                            <span className="font-medium">Total Raw Material Stock</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {rawMaterialTotalLitres.toLocaleString()} L
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Low Stock Items Card */}
            <Card className="shadow-md border-border/60 hover:shadow-lg transition-shadow row-span-1 md:row-span-2">
                <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                        <BellRing className="h-6 w-6 text-yellow-500 animate-pulse" />
                        <CardTitle className="text-xl font-semibold tracking-tight">Low Stock Alerts</CardTitle>
                    </div>
                    <CardDescription>Items needing attention or reordering soon.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-5">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                            <FlaskConical className="h-4 w-4 mr-1.5 text-blue-500" />
                            Ingredients
                        </h3>
                        {renderLowStockList(lowStockIngredients, "ingredient")}
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                            <Boxes className="h-4 w-4 mr-1.5 text-purple-500" />
                            Raw Materials
                        </h3>
                        {renderLowStockList(lowStockRawMaterials, "rawMaterial")}
                    </div>
                </CardContent>
            </Card>

            {/* Ingredient Breakdown Card */}
            <Card className="shadow-md border-border/60 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                        <ListTree className="h-6 w-6 text-green-500" />
                        <CardTitle className="text-xl font-semibold tracking-tight">Ingredient Breakdown</CardTitle>
                    </div>
                    <CardDescription>Current stock levels for each ingredient.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {renderBreakdownList(ingredientBreakdown, "ingredient")}
                </CardContent>
            </Card>

            {/* Raw Material Breakdown Card */}
            <Card className="shadow-md border-border/60 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                        <ListTree className="h-6 w-6 text-teal-500" />
                        <CardTitle className="text-xl font-semibold tracking-tight">Raw Material Breakdown</CardTitle>
                    </div>
                    <CardDescription>Current stock levels for each raw material.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {renderBreakdownList(rawMaterialBreakdown, "rawMaterial")}
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryDashboard;