'use client';
import {ProductCard} from "./ProductCard";
import {CreateAProductButton} from "@/app/components/production/CreateAProductButton";
import {useProductStore} from "@/app/store/productStore";
import {useEffect} from "react";


export default function ProductsPage() {
    const {products,fetchProducts} = useProductStore();

    useEffect(() => {
        fetchProducts();
    },[fetchProducts]);

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 w-full">
                <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center">
                    <div className="text-3xl font-bold ">
                        Products
                    </div>
                    <CreateAProductButton/>

                </nav>

                <div className="flex flex-col w-full flex-1 p-4 space-y-6">

                    {
                        products && products.length>0 ? <div className={"grid grid-cols-5 w-full"}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))

                            }
                        </div>:<div className={"flex justify-center items-center  w-full"}>
                            <p className={"text-center text-gray-500"}>No products found</p>
                        </div>
                    }

                </div>

            </div>
        </>
    );
}