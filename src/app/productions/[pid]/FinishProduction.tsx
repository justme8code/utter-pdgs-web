'use client';
import {useProductionStore} from "@/app/store/productionStore";
import {finishProduction} from "@/app/actions/production";
import {useState} from "react";
import {AppDialog} from "@/app/ui/dailog/AppDialog";
import LoadingWrapper from "@/app/components/LoadingWrapper";

export const FinishProduction = () => {
    const {selectedProduction,setSelectedProduction} = useProductionStore();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFinishProduction = async () => {
        setIsLoading(true);
        if(selectedProduction?.id){
            const {status} = await finishProduction(selectedProduction?.id);
            if(status){
                setSelectedProduction({...selectedProduction,finalized:true});
                setIsOpen(true);

            }
        }
        setIsLoading(false);
    }
    return (
        <>
            {!selectedProduction?.finalized && (
                <div className={"absolute right-0 bottom-0 p-4"}>
                    <button onClick={handleFinishProduction} className={"  bg-sky-700 text-white p-2 rounded-md"}>
                        Finish Production
                    </button>
                    <LoadingWrapper isLoading={isLoading}>
                    </LoadingWrapper>
                    <AppDialog isOpen={isOpen} onClose={() => {}}>
                        {
                            selectedProduction?.finalized === true ? <p>Production ended</p> : <p>Unable to end production</p>
                        }
                        <div className={"flex justify-end"}>
                            <button onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </AppDialog>
                </div>
            )}
        </>
    );
};