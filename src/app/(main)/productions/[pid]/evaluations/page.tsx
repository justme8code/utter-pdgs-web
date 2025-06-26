import {getEvaluationsByProductions} from "@/api/evaluation"; // Adjust path as needed
import {fetchProduction} from "@/api/production";
import {EvaluationsListClient} from "@/app/(main)/productions/[pid]/evaluations/EvaluationsListClient"; // To get production details

// Pages in the App Router can receive `params`
interface ProductionEvaluationsPageProps {
    params: {
        pid: string; // Params from the URL are always strings
    };
}

export default async function ProductionEvaluationsPage({params}: ProductionEvaluationsPageProps) {
    const productionId = parseInt(params.pid, 10);

    // Handle cases where the ID is not a valid number
    if (isNaN(productionId)) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid Production ID</h1>
                <p className="text-muted-foreground">The provided ID is not a valid number.</p>
            </div>
        );
    }

    // Fetch the data in parallel for better performance
    const [evaluationsResponse, productionResponse] = await Promise.all([
        getEvaluationsByProductions(productionId),
        fetchProduction(productionId)
    ]);

    const {data: evaluations, status: evaluationsStatus} = evaluationsResponse;
    const {data: production, status: productionStatus} = productionResponse;

    // Handle potential errors during data fetching
    if (!evaluationsStatus || !productionStatus) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-destructive">Failed to Load Data</h1>
                <p className="text-muted-foreground">Could not retrieve evaluations for this production.</p>
            </div>
        );
    }

    // If we have data, we pass it to a client component for rendering
    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {evaluations && evaluations.length > 0 && production && (
                <EvaluationsListClient initialEvaluations={evaluations} production={production}/>
            )}
        </div>
    );
}