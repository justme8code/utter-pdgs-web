import useRawMaterialStore from "@/app/store/useRawMaterialStore";
import useSupplierStore from "@/app/store/SupplierStore";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {useEffect} from "react";

export const LoadData = () => {
    const {fetchRawMaterials} = useRawMaterialStore();
    const {fetchIngredients} = useIngredientStore();
    const {fetchSuppliers} = useSupplierStore()

    useEffect(() => {
        fetchIngredients();
        fetchRawMaterials();
        fetchSuppliers();
    },[fetchIngredients, fetchRawMaterials, fetchSuppliers]);
    return (
        <>
        </>
    );
};