'use client';
import {useProductionStore} from "@/app/store/productionStore";
import {ExtendedProductionResponse} from "@/app/data_types";
import {useEffect} from "react";

export const LoadSelectedProduction = ({data}:{data:ExtendedProductionResponse}) => {
    const {setSelectedProduction} = useProductionStore();
    useEffect(() => {
        setSelectedProduction(data);
    }, [data, setSelectedProduction]);
    return (
        <></>
    );
};