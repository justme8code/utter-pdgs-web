'use client';
import {Ingredients} from "@/app/my_components/inventory/Ingredients";

export default function IngredientInventoryPage() {


    return (
        <div>
            <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center w-full">
                <div className="text-2xl font-bold">
                     Ingredients
                </div>

            </nav>
            <div className={"flex p-4"}>
                <Ingredients/>
            </div>
        </div>
    );
}