'use client';
import React, {useEffect, useState} from "react";
import { useProductStore } from "@/app/store/productStore";
import { Plus, XIcon } from "lucide-react";
import { ProductMixComponent } from "@/app/components/production/productMix/ProductMixComponent";
import {fetchProductionMixes} from "@/app/actions/production";
import {useProductionStore} from "@/app/store/productionStore";
import { Modal } from "../../Modal";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {ProductMix} from "@/app/product";


export const ProductMixPage = () => {
    const {fetchProducts } = useProductStore();
    const { selectedProduction } = useProductionStore();
    const {ingredients,fetchIngredients} = useIngredientStore();
    const [productionMixes, setProductionMixes] = useState<ProductMix[]>([]);
    const [edit, setEdit] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if(selectedProduction?.id){
            const fetchMixes = async ()=>{
                const {data,status} = await fetchProductionMixes(selectedProduction?.id);
                if(status){
                    setProductionMixes(data??[]);
                }
            }
            fetchMixes();
        }
    }, [selectedProduction?.id]);


    useEffect(() => {
        fetchIngredients();
        fetchProducts();
    }, [fetchIngredients, fetchProducts]);


    return (
         <>
             {/* New button to open the modal */}
             {ingredients && ingredients.length > 0 && (
                 <button
                     className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                     onClick={() => setIsModalOpen(true)}
                 >
                     Create Production Mix
                 </button>
             )}
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className={"w-full h-screen"}>
                 <div className={"p-6 space-y-5 "}>
                     <div className={"flex justify-between"}>
                         <h1 className={"text-xl font-bold"}>Production Mix</h1>
                         {ingredients && ingredients.length > 0&& <div className={"flex gap-5"}>
                            {!edit && (

                                 <button
                                     className={`flex items-center text-xs bg-gray-300 text-black hover:bg-gray-400 font-bold p-1 px-3 rounded-sm`}
                                     onClick={() => {setEdit(true)}}
                                 >
                                     <Plus />
                                     <p className="ml-2">Add mix</p>
                                 </button>

                             )}
                         </div>}
                     </div>

                     <div className={"max-h-svh overflow-y-auto"}>
                         <React.Fragment>
                             {
                                 edit && (
                                     <div className={"mb-5"}>
                                         <h1 className={"font-bold text-gray-600"}>Create a new Product Mix</h1>
                                         <div className="relative mt-4 space-y-5">
                                             <button
                                                 className="absolute right-0 -top-3 text-red-500 hover:text-red-700"
                                                 onClick={() =>  {setEdit(false)}}
                                                 title="Remove mix"
                                             >
                                                 <XIcon className="h-4 w-4" />
                                             </button>
                                             <ProductMixComponent onSave={mix => {
                                                 setProductionMixes(prevState => [...prevState, mix]);
                                             }} mix={{}} />

                                         </div>
                                     </div>
                                 )
                             }
                         </React.Fragment>

                         <div className={"bg-gray-100 w-full p-5 space-y-10 rounded-xs"}>
                             {productionMixes && ingredients &&  productionMixes.length > 0 && ingredients.length> 0? [...productionMixes]
                                 .sort((a, b) => a.id - b.id)
                                 .map((value, index) => (
                                     <div key={index} className={"space-y-5"}>
                                         <ProductMixComponent
                                             mix={value}
                                             onSave={mix => {
                                                 setProductionMixes(prevState => [...prevState, mix]);
                                             }}
                                             onDelete={status => {
                                                 if (status) {
                                                     setProductionMixes(prev => prev.filter((_, i) => i !== index));
                                                 }
                                             }}
                                         />
                                         {index !== productionMixes.length - 1 && (
                                             <div className={"h-0.5 w-full bg-gray-200"}></div>
                                         )}
                                     </div>
                                 )): <div className={"flex justify-center "}>
                                 <h1 className={"text-xl font-medium text-gray-500"}>Can't create a production mix without an ingredient</h1>
                             </div>}
                         </div>
                     </div>
                 </div>
             </Modal>

         </>
    );
};
