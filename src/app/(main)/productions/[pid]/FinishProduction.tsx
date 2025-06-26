'use client';
import {useProductionStore} from "@/app/store/productionStore";

import {useState} from "react";
import {AppDialog} from "@/app/ui/dailog/AppDialog"; // Assuming this is your custom dialog
import {Button} from "@/components/ui/button"; // Shadcn Button
import {AlertTriangle, CheckCircle, Flag, XCircle} from "lucide-react";
import {finishProduction} from "@/api/production"; // Icons

export const FinishProduction = () => {
    const {selectedProduction, setSelectedProduction} = useProductionStore();
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const handleOpenConfirm = () => {
        setIsConfirmOpen(true);
    };

    const handleFinishProduction = async () => {
        setIsConfirmOpen(false); // Close confirmation dialog
        setIsLoading(true);
        if (selectedProduction?.id) {
            const {status} = await finishProduction(selectedProduction.id); // Use renamed action
            if (status) {
                setSelectedProduction({...selectedProduction, finalized: true});
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
            setIsResultOpen(true); // Open result dialog
        }
        setIsLoading(false);
    };

    if (selectedProduction?.finalized) {
        return null; // Don't show button if already finalized
    }

    return (
        <>
            <div className="fixed right-6 bottom-6 z-50"> {/* Changed absolute to fixed for consistent positioning */}
                <Button
                    onClick={handleOpenConfirm}
                    disabled={isLoading}
                    size="lg"
                    variant="default" // Or "destructive" if it's a critical action
                    className="shadow-lg bg-green-600 hover:bg-green-700 text-white" // Example custom color
                >
                    <Flag className="mr-2 h-5 w-5"/>
                    {isLoading ? "Finishing..." : "Finalize Production"}
                </Button>
            </div>

            {/* Confirmation Dialog */}
            <AppDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirm Finalization">
                <div className="p-1 space-y-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-10 w-10 text-yellow-500 mt-1 flex-shrink-0"/>
                        <div>
                            <p className="font-medium">Are you sure you want to finalize this production?</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                This action will mark the production as completed and may prevent further edits.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleFinishProduction} className="bg-green-600 hover:bg-green-700 text-white">
                            Yes, Finalize
                        </Button>
                    </div>
                </div>
            </AppDialog>

            {/* Result Dialog */}
            <AppDialog isOpen={isResultOpen} onClose={() => setIsResultOpen(false)}
                       title={isSuccess ? "Production Finalized" : "Finalization Failed"}>
                <div className="p-1 space-y-4 text-center">
                    {isSuccess ? (
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3"/>
                    ) : (
                        <XCircle className="h-12 w-12 text-destructive mx-auto mb-3"/>
                    )}
                    <p className="text-lg font-medium">
                        {isSuccess ? "Production has been successfully finalized!" : "Unable to finalize the production."}
                    </p>
                    {!isSuccess &&
                        <p className="text-sm text-muted-foreground">Please check for any pending tasks or try
                            again.</p>}
                    <div className="flex justify-center pt-2">
                        <Button variant="outline" onClick={() => setIsResultOpen(false)}>Close</Button>
                    </div>
                </div>
            </AppDialog>

            {/* Loading wrapper for the button itself if needed during action, though button's disabled state is often enough */}
            {/* <LoadingWrapper isLoading={isLoading}></LoadingWrapper> */}
        </>
    );
};