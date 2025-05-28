
import { PurchaseTransfer } from "@/app/types";
import {TransferButton} from "@/app/ui/production/TransferButton";

export const TransferCard = ({ transfer }: { transfer: PurchaseTransfer }) => {
    const { purchase, fromProductionId, fromProductionName, transferred, transferNotes } = transfer;

    return (
        <div className="border rounded-xl shadow p-4 border-gray-100 bg-white space-y-2 mb-5">
            <div className="text-lg font-semibold text-gray-800">
                Transfer from: {fromProductionName} (ID: {fromProductionId})
            </div>
            <div className="text-sm text-gray-600">
                <p><span className="font-medium">Transferred:</span> {transferred ? "Yes" : "No"}</p>
                <p><span className="font-medium">Notes:</span> {transferNotes ? "Available" : "None"}</p>
            </div>
            <div className="mt-2 border-t pt-2 text-sm  border-t-gray-200 text-gray-700">
                <p><span className="font-medium">Raw Material:</span> {purchase.rawMaterialName}</p>
                <p><span className="font-medium">Weight:</span> {purchase.rawMaterialUom} </p>
                <p><span className="font-medium">Usable Weight:</span> {purchase.purchaseUsageUsableWeightLeft} </p>
                <p><span className="font-medium">Cost:</span> ${purchase.cost?.toFixed(2) ?? "N/A"}</p>
            </div>
            <TransferButton  purchaseToTransfer={transfer.id} />
        </div>
    );
};
