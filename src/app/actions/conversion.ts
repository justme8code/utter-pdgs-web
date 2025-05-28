'use server';
import {Conversion, ProductionStore, Purchase} from "@/app/types";
import {makeAuthRequest} from "@/app/actions/main";

export async function createConversion(productionId:number,purchaseId:number, conversion:Conversion){
    const {data,status,error} = await makeAuthRequest<Conversion,{productionStore:ProductionStore, purchase:Purchase, conversion:Conversion}>({
        url: `/productions/${productionId}/purchases/${purchaseId}/conversions`,
        method: "POST",
        data: conversion
    });
    return {data:data,status:status === 201,message:status===201?"Conversion created successfully":"Could not create conversion" };
}
