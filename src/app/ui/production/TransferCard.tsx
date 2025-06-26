// app/ui/production/TransferCard.tsx (Assuming path)
import {PurchaseTransfer} from "@/app/types";
import {TransferButton} from "./TransferButton"; // Assuming this is already styled or a Shadcn button
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {ArrowRightLeft, Box, CheckCircle, DollarSign, FileText, Weight, XCircle} from "lucide-react"; // Icons

export const TransferCard = ({transfer}: { transfer: PurchaseTransfer }) => {
    const {purchase, fromProductionId, fromProductionName, transferred, transferNotes} = transfer;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                            <ArrowRightLeft className="h-4 w-4 text-primary"/>
                            From: {fromProductionName || "Unknown Production"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Production ID: {fromProductionId}
                        </CardDescription>
                    </div>
                    <Badge variant={transferred ? "default" : "secondary"}
                           className={transferred ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" : ""}>
                        {transferred ? <CheckCircle className="mr-1 h-3.5 w-3.5"/> :
                            <XCircle className="mr-1 h-3.5 w-3.5"/>}
                        {transferred ? "Transferred" : "Available"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2 pt-0">
                {transferNotes && (
                    <div className="p-2 bg-muted/50 rounded-md text-muted-foreground italic flex items-start gap-1.5">
                        <FileText className="h-3.5 w-3.5 mt-0.5 flex-shrink-0"/>
                        <span>Notes: {transferNotes}</span>
                    </div>
                )}
                <Separator className="my-2"/>
                <div className="space-y-1 text-muted-foreground">
                    <p className="flex items-center gap-1"><Box className="h-3.5 w-3.5"/><strong>Material:</strong>
                        <span className="text-foreground">{purchase.rawMaterialName}</span></p>
                    <p className="flex items-center gap-1"><Weight className="h-3.5 w-3.5"/><strong>UoM:</strong> <span
                        className="text-foreground">{purchase.rawMaterialUom}</span></p>
                    <p className="flex items-center gap-1"><Weight className="h-3.5 w-3.5"/><strong>Available
                        Weight:</strong> <span
                        className="text-foreground">{purchase.purchaseUsageUsableWeightLeft}</span></p>
                    <p className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5"/><strong>Cost:</strong>
                        <span className="text-foreground">₦{purchase.cost?.toFixed(2) ?? "N/A"}</span></p>
                </div>
            </CardContent>
            {!transferred && ( // Only show transfer button if not already transferred
                <CardFooter className="pt-3">
                    {/* Ensure TransferButton is styled as a Shadcn Button or replace it */}
                    <TransferButton purchaseToTransferId={transfer.id}/>
                </CardFooter>
            )}
        </Card>
    );
};