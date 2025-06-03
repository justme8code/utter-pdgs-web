'use client';

import { useEffect,  useState } from "react"; // Added useMemo
import { Production, ProductionOverviewData } from "@/app/types";
import { fetchProductionOverview } from "@/api/dashboardActions"; // Adjust path as needed

// Shadcn UI Imports
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar"; // <-- Import Calendar

import {
    AlertCircle,
    CalendarDays,
    UserCircle,
    Loader2,
    Archive,
    ListChecks,
    BarChart3,
    Package,
    LayoutDashboard,
    CalendarClock // <-- Icon for Calendar Card
} from "lucide-react";

// Helper component to display a single production item (No changes here)
const ProductionItemCard = ({ production }: { production: Production }) => {
    // ... (previous ProductionItemCard code remains the same)
    return (
        <Card className={`
            w-full hover:shadow-xl transition-shadow duration-300 ease-in-out
            border-l-4 ${production.finalized ? 'border-green-500' : 'border-blue-500'}
            bg-card/80 backdrop-blur-sm
        `}>
            <CardHeader className="pb-3 pt-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg leading-tight">{production.name}</CardTitle>
                        {production.productionNumber && (
                            <CardDescription className="text-xs mt-1">
                                ID: {production.productionNumber}
                            </CardDescription>
                        )}
                    </div>
                    <Badge
                        variant={production.finalized ? "default" : "secondary"}
                        className={`
                            ${production.finalized ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-300 dark:border-green-600'
                            : 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600'}
                            font-medium text-xs px-2 py-0.5
                        `}
                    >
                        {production.finalized ? 'Finalized' : 'In Progress'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2 pt-0 pb-4">
                <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                        {new Date(production.startDate).toLocaleDateString()} - {new Date(production.endDate).toLocaleDateString()}
                    </span>
                </div>
                {production.staff && (
                    <div className="flex items-center text-muted-foreground">
                        <UserCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                            Staff: {production.staff.userFullName}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Skeleton for the ProductionItemCard (No changes here)
const ProductionItemCardSkeleton = () => {
    // ... (previous ProductionItemCardSkeleton code remains the same)
    return (
        <Card className="w-full border-l-4 border-transparent">
            <CardHeader className="pb-3 pt-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-6 w-3/4 mb-1" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2 pt-0 pb-4">
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>
        </Card>
    );
}

export const ProductionOverView = () => {
    const [overviewData, setOverviewData] = useState<ProductionOverviewData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // State for dates to highlight in the calendar
    const [productionActivityDates, setProductionActivityDates] = useState<Date[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data, status } = await fetchProductionOverview();
                if (status && data) {
                    setOverviewData(data);
                } else {
                    setError("Failed to fetch production overview data. The server might be unreachable or returned an empty response.");
                    console.error("API Error: Failed to fetch production overview, status indicates failure or data is null");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching production data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Effect to process production dates for calendar highlighting
    useEffect(() => {
        if (overviewData) {
            const allProductions = [
                ...overviewData.productionsInProgress,
                ...overviewData.recentProductions,
            ];
            const datesSet = new Set<number>(); // Store time in ms to ensure uniqueness

            allProductions.forEach(production => {
                // Add start date (normalized to start of day)
                const startDate = new Date(production.startDate);
                startDate.setHours(0, 0, 0, 0);
                datesSet.add(startDate.getTime());

                // Add end date (normalized to start of day)
                const endDate = new Date(production.endDate);
                endDate.setHours(0, 0, 0, 0);
                datesSet.add(endDate.getTime());
            });

            setProductionActivityDates(Array.from(datesSet).map(time => new Date(time)));
        }
    }, [overviewData]);


    if (loading) {
        return (
            <Card className="w-full shadow-lg border-border/60">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <div>
                            <Skeleton className="h-8 w-48 mb-1" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* KPI Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {[...Array(3)].map((_, i) => ( // Assuming 3 KPI cards
                            <Card key={i} className="bg-muted/30">
                                <CardHeader className="pb-2 pt-4">
                                    <Skeleton className="h-4 w-3/5 mb-1" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Skeleton className="h-10 w-1/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Calendar Skeleton */}
                    <Card className="bg-muted/30">
                        <CardHeader className="pb-2 pt-4">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-6 w-6 rounded-sm" />
                                <Skeleton className="h-5 w-2/5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2 flex justify-center items-center">
                            <Skeleton className="h-64 w-full max-w-xs rounded-md" />
                        </CardContent>
                    </Card>


                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        <section>
                            <div className="flex items-center mb-6">
                                <Skeleton className="h-7 w-7 mr-3 rounded-md" />
                                <Skeleton className="h-7 w-3/5" />
                            </div>
                            <div className="space-y-4">
                                <ProductionItemCardSkeleton />
                                <ProductionItemCardSkeleton />
                            </div>
                        </section>
                        <section>
                            <div className="flex items-center mb-6">
                                <Skeleton className="h-7 w-7 mr-3 rounded-md" />
                                <Skeleton className="h-7 w-3/5" />
                            </div>
                            <div className="space-y-4">
                                <ProductionItemCardSkeleton />
                            </div>
                        </section>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Alert variant="destructive" className="max-w-lg shadow-lg">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="font-semibold text-lg">Oops! Something went wrong.</AlertTitle>
                    <AlertDescription className="mt-1">{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!overviewData || (overviewData.productionsInProgress.length === 0 && overviewData.recentProductions.length === 0 && overviewData.totalProductions === 0)) {
        return (
            <Card className="w-full shadow-lg border-border/60">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <LayoutDashboard className="h-7 w-7 text-muted-foreground" />
                        <div>
                            <CardTitle className="text-2xl font-bold">Production Overview</CardTitle>
                            <CardDescription>A summary of ongoing and recent productions.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-xl font-medium text-muted-foreground">No Production Data Available</p>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                        {"There's nothing to show here right now. Start a new production to see it appear."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border-border/60 bg-card/95 backdrop-blur-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                    <LayoutDashboard className="h-7 w-7 text-primary" />
                    <div>
                        <CardTitle className="text-2xl tracking-tight font-bold">Production Overview</CardTitle>
                        <CardDescription>A summary of ongoing and recent productions.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* KPIs Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-primary/90">
                                Total Active & Recent
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold text-primary">
                                {overviewData.totalProductions}
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">
                                Combined total of productions
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-sky-600 dark:text-sky-400">
                                In Progress
                            </CardTitle>
                            <ListChecks className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                                {overviewData.productionsInProgress.length}
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">
                                Currently active productions
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Recently Finalized
                            </CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {overviewData.recentProductions.length}
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">
                                Productions completed recently
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Card Section */}
                <Card className="hover:shadow-md transition-shadow border-border/60">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                            <CalendarClock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-semibold tracking-tight">Production Activity Calendar</CardTitle>
                        </div>
                        <CardDescription className="text-xs pl-7">
                            Dates with production start or end activity are highlighted.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 flex justify-center">
                        <Calendar
                            mode="multiple" // Allows multiple days to be "selected" visually via modifiers
                            selected={productionActivityDates} // Visually marks these dates, works with modifiersClassNames
                            onSelect={() => {}} // No action on select for now, but required for "multiple" mode
                            modifiers={{
                                activity: productionActivityDates,
                            }}
                            modifiersClassNames={{
                                activity: "bg-primary/20 text-primary-foreground rounded-md font-semibold",
                            }}
                            className="rounded-md p-0" // p-0 to remove default padding if card provides it
                            classNames={{ // Finer control over internal calendar styles
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md", // Style for selected days
                                day_today: "text-accent-foreground bg-accent/50 rounded-md", // Style for today
                            }}
                            showOutsideDays={false}
                            // You can set defaultMonth to the earliest production month if desired
                            // defaultMonth={productionActivityDates.length > 0 ? productionActivityDates[0] : new Date()}
                        />
                    </CardContent>
                </Card>


                <Separator className="my-6" />

                {/* Production Lists Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <section>
                        <div className="flex items-center mb-5">
                            <ListChecks className="h-6 w-6 mr-3 text-blue-500" />
                            <h3 className="text-xl font-semibold tracking-tight">
                                Productions In Progress
                                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300">
                                    {overviewData.productionsInProgress.length}
                                </Badge>
                            </h3>
                        </div>
                        {overviewData.productionsInProgress.length > 0 ? (
                            <ul className="space-y-4">
                                {overviewData.productionsInProgress.map((production) => (
                                    <li key={production.id || production.productionNumber}>
                                        <ProductionItemCard production={production} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                                <Loader2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3 animate-pulse" />
                                <p className="text-muted-foreground font-medium">No productions currently in progress.</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">Looks like everything is on track or waiting to start!</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center mb-5">
                            <Archive className="h-6 w-6 mr-3 text-green-500" />
                            <h3 className="text-xl font-semibold tracking-tight">
                                Recent Productions
                                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">
                                    {overviewData.recentProductions.length}
                                </Badge>
                            </h3>
                        </div>
                        {overviewData.recentProductions.length > 0 ? (
                            <ul className="space-y-4">
                                {overviewData.recentProductions.map((production) => (
                                    <li key={production.id || production.productionNumber}>
                                        <ProductionItemCard production={production} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                                <Archive className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                                <p className="text-muted-foreground font-medium">No recent productions to display.</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">Completed productions will appear here.</p>
                            </div>
                        )}
                    </section>
                </div>
            </CardContent>
        </Card>
    );
};