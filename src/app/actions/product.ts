'use server';
import {makeAuthRequest} from "@/app/actions/main";
import {Pageable, Product, ProductMix} from "@/app/types";

export async function createProduct(product:Product){
    const {data,status} = await makeAuthRequest<Product,Product>({
        url: `/products`,
        method: "POST",
        data: product,
    })

    return {data, status:status === 201 };
}


export async function getProducts(){
    const {data,status} = await makeAuthRequest<null,Product[]>({
        url: `/products`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}


export async function fetchProductMixes(page:number,size:number,search:string){
    const {data,status} = await makeAuthRequest<number[],Pageable<ProductMix>>({
        url: `/product-mixes/page?search=${search}&page=${page}&size=${size}`,
        method: "GET",
    });
    return {data:data,status:status === 200 };
}