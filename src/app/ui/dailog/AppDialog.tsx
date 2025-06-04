import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import React from "react";

type MyDialogProps = {
    children?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    className?: string;
}
export const AppDialog = ({className,title,description,children, isOpen=false, onClose}:MyDialogProps) => {
    return (
        <Dialog open={isOpen} onClose={()=>{onClose()}} className={"z-50"}>
            <div className={`fixed inset-0 flex w-screen items-center justify-center p-4`}>
                <DialogPanel
                    transition
                    className={`w-full shadow-lg  max-w-2xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 ${className}`}
                >
                    <div className={"mb-5  border-b-1 border-gray-200 space-y-3 p-2"}>
                        <DialogTitle className={"text-xl font-medium"}>{title}</DialogTitle>
                        <Description className={"text-gray-500"}>
                            {description}
                        </Description>
                    </div>
                    {children}
                </DialogPanel>
            </div>

        </Dialog>
    );
};