// /app/(main)/evaluations/create/page.tsx  (Assuming this is the file path)

import {ProductionEvaluationForm} from "@/app/(main)/evaluations/ProductionEvaluationForm";

// Define the shape of the props for the page
interface CreateEvaluationPageProps {
    searchParams: {
        // All search params are strings or arrays of strings by default
        productionId?: string;
    };
}

// Your page is now a Server Component that accepts props
export default function CreateEvaluationPage({searchParams}: CreateEvaluationPageProps) {
    // 1. Get the productionId from the searchParams. It will be a string.
    const productionIdString = searchParams.productionId;

    // 2. Validate and convert the ID to a number.
    //    We use `parseInt` and check for `!isNaN` to handle cases where the param is missing or not a number.
    const productionId = productionIdString ? parseInt(productionIdString, 10) : null;

    // 3. Handle the case where the ID is missing or invalid.
    //    You can render an error message, a "not found" component, or redirect.
    if (productionId === null || isNaN(productionId)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center p-8 border rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Invalid ID</h1>
                    <p className="text-muted-foreground">{"A valid 'productionId' is required to create an evaluation."}</p>
                </div>
            </div>
        );
    }

    // 4. If the ID is valid, render the form and pass the ID as a prop.
    return (
        <ProductionEvaluationForm productionId={productionId}/>
    );
};