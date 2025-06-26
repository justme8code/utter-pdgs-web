import {AppDialog} from "@/app/ui/dailog/AppDialog";
import {ReactNode} from "react";

interface ErrorDialogProps {
    title: string;
    description: string;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;

}

export const ErrorDialog = ({isOpen, title, description, children, onClose}: ErrorDialogProps) => {
    return (
        <>
            <AppDialog isOpen={isOpen} onClose={() => {
                onClose()
            }} title={title} description={description}>
                {children}
            </AppDialog>

        </>
    );
};