'use client';
import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {HandCoins, X} from "lucide-react"; // Example icon for Balance

interface BalanceSheetProps {
    children?: React.ReactNode; // This will be the TransferList
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({children}) => {
    // The open/close state is managed by the Sheet component itself when using SheetTrigger
    // If you need to control it programmatically, you can add an `open` and `onOpenChange` prop to <Sheet>
    // const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <HandCoins className="mr-2 h-4 w-4"/>
                    View Balances
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col"
                          side="right"> {/* Control width, remove padding for custom layout */}
                <SheetHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
                    <div className="flex justify-between items-center">
                        <SheetTitle className="text-xl flex items-center gap-2">
                            <HandCoins className="h-5 w-5 text-primary"/>
                            Available Balances
                        </SheetTitle>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <X className="h-4 w-4"/>
                                <span className="sr-only">Close</span>
                            </Button>
                        </SheetClose>
                    </div>
                    <SheetDescription className="text-xs">
                        Review transferable balances from other productions.
                    </SheetDescription>
                </SheetHeader>

                {/* Scrollable content area */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {children} {/* This is where TransferList will be rendered */}
                </div>

                {/* Optional Footer */}
                {/* <SheetFooter className="p-6 pt-4 border-t sticky bottom-0 bg-background z-10">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    );
};