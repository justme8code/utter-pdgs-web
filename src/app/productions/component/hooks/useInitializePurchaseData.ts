import { useEffect } from 'react';
import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";

export const useInitializePurchaseData = () => {
    const { fetchRawMaterials, rawMaterials } = useRawMaterialStore();
    const { fetchSuppliers, suppliers } = useSupplierStore();

    useEffect(() => {
        const fetchData = async () => {
            if (rawMaterials.length === 0) {
                await fetchRawMaterials();
            }
            if (suppliers.length === 0) {
                await fetchSuppliers();
            }
        };
        fetchData();
    }, [fetchRawMaterials, fetchSuppliers, rawMaterials.length, suppliers.length]); // Be explicit with dependencies

    return { rawMaterials, suppliers };
};