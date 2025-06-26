'use client';
import {Ingredients} from "@/app/my_components/inventory/Ingredients";
import {Navbar} from "@/components/layout/Navbar";

export default function IngredientInventoryPage() {


    return (
        <div className={"p-8"}>
            <Navbar title={"Ingredients"}/>
            <div className={"flex p-4 justify-center"}>
                <Ingredients/>
            </div>
        </div>
    );
}