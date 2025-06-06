
import {Milk} from "lucide-react";
import {Product} from "@/app/types";

export const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 max-w-56 flex flex-col justify-between">

            <div className={"flex w-full justify-center"}>
                <Milk className="w-20 h-60 text-gray-500"/>
            </div>
             <div className={"space-y-2"}>
                 <h2 className="text-sm font-semibold text-center">{product.name}</h2>
                 {/*  <p className="text-gray-600 text-xs text-center">{product.description}</p>*/}
                 <div className={"flex flex-wrap items-center gap-1"}>
                     <h1 className={"text-sm items-center font-bold"}>Ingredients</h1>
                     <div className={"flex "}>
                         {product.ingredients.map((ingredient) => (
                             <p className={"text-xs"} key={ingredient.id}>{ingredient.name}</p>
                         ))}
                     </div>
                 </div>
             </div>
            {/*<p className="text-blue-500 font-bold mt-2 text-center">${product.price.toFixed(2)}</p>*/}
            <button className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                {product.totalProductMixCount} Mixes
            </button>
        </div>
    );
};