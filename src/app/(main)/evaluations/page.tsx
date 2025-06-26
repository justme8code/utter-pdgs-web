// src/app/evaluations/page.tsx

import {Navbar} from '@/components/layout/Navbar';
import {Evaluation, EvaluationListItem} from "@/components/EvaluationListItem";
import {nonFinalizedProductions} from "@/api/production";
import {AwaitingEvaluationList} from "@/app/(main)/evaluations/AwaitingEvaluationList";

// --- MOCK DATA for completed evaluations (can be replaced with a real API call later) ---
const mockEvaluations: Evaluation[] = [
    // ... (your existing mock evaluation data remains here for now)
    {
        id: 'eval_001',
        name: 'Alice Johnson',
        batchRange: 'BATCH-001-050',
        manufacturingDate: new Date('2023-10-01'),
        expiryDate: new Date('2024-10-01'),
        products: [
            {title: 'Watermelon and pineapple', release: 'Yes'},
            {title: 'Carrot and pineapple with ginger', release: 'Yes'},
        ],
    },
    {
        id: 'eval_002',
        name: 'Bob Williams',
        batchRange: 'BATCH-051-100',
        manufacturingDate: new Date('2023-10-05'),
        expiryDate: new Date('2024-10-05'),
        products: [
            {title: 'Pineapple', release: 'Yes'},
            {title: 'Pineapple and ginger', release: 'No'},
        ],
    },
];
// --- END MOCK DATA ---


// Make the page component async to use await for data fetching
const AllEvaluationsPage = async () => {

    // Fetch the real data for productions awaiting evaluation
    const {data: productionsToEvaluate} = await nonFinalizedProductions();

    // Fetch completed evaluations (using mock data for now)
    const completedEvaluations = mockEvaluations;

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <Navbar title="Product Evaluations"/>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Evaluations</h1>
                    <p className="text-muted-foreground">Evaluate new productions or review past evaluations.</p>
                </div>
            </div>

            {/* Use the new, self-contained component. Pass the fetched data as a prop. */}
            {/* The `|| []` ensures we pass an empty array if the API call fails or returns null. */}
            <AwaitingEvaluationList productions={productionsToEvaluate || []}/>

            {/* SECTION 2: Evaluation History (remains the same) */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Evaluation History</h2>
                    <p className="text-muted-foreground">A log of all previously completed product evaluations.</p>
                </div>
                <div className="border rounded-lg bg-background">
                    {completedEvaluations.length > 0 ? (
                        <div>
                            {completedEvaluations.map((evaluation) => (
                                <EvaluationListItem key={evaluation.id} evaluation={evaluation}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12">
                            <h2 className="text-xl font-semibold">No History Found</h2>
                            <p className="text-muted-foreground mt-2">
                                Completed evaluations will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllEvaluationsPage;