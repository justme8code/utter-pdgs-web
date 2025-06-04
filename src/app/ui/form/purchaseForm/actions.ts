import {PurchaseForm} from "@/app/ui/form/purchaseForm/FormPurchase";
import {Purchase, RawMaterial, Supplier} from "@/app/types";

// convert to purchase entity
export function convertToPurchaseEntity(purchaseForm:PurchaseForm, rawMaterials:RawMaterial[],suppliers:Supplier[]){
    const findRawMaterial = rawMaterials.find((rawMaterial)=> rawMaterial.id===purchaseForm.rawMaterialId);
    const findSupplier = suppliers.find((supplier)=>supplier.id===purchaseForm.supplierId);
     const purchase: Purchase = {
         ...purchaseForm,
         rawMaterial:findRawMaterial,
         supplier:findSupplier
     }
     return purchase;
}
// update purchase;