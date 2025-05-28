import {TextField} from "@/app/components/TextField";
import {RotateCw} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {useProductionStore} from "@/app/store/productionStore";
import {ProductSelector} from "@/app/components/production/productMix/ProductSelector";
import {createProductMix, updateProductMix} from "@/app/actions/productMix";
import {ProductionStore, ProductMix} from "@/app/types";
import {useLoadingUI} from "@/app/store/useLoadingUI";

interface ProductMixComponentProps {
    mix: ProductMix | null; // Updated to allow null
    onSaveProductMix: (mix: ProductMix,productionStore:ProductionStore) => void;
    onDelete?: (status: boolean) => void;
    onEdit?: boolean;
}

export const ProductMixComponent = ({onEdit, mix, onSaveProductMix}: ProductMixComponentProps) => {
    // Initialize state with mix or fallback to an empty object cast as ProductMix
    const [productMix, setProductMix] = useState<ProductMix>(mix || {} as ProductMix);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const {selectedProduction} = useProductionStore();
    const { products,fetchProducts} = useProductStore();
    const [message,setMessage] = useState<string | null>(null);

    const {setLoading,loading,setSuccessMessage} = useLoadingUI();

    useEffect(() => {
        setProductMix(mix || {} as ProductMix);
        if (mix && mix.productId) {
            setSelectedProductId(mix.productId);
        }
    }, [mix, products, fetchProducts]);


    const selectedProduct = useMemo(() => {
        return products.find(product => product.id === selectedProductId);
    }, [products, selectedProductId]);


    const ingredients = selectedProduct?.ingredients || [];

    const handleCheck = (): boolean => {
        let isValid = true;
        const issues: string[] = [];

        productMix.productMixIngredients?.forEach((ingU) => {
            const matchingStore = selectedProduction?.productionStore?.ingredientStores.find(
                (ingS) => ingS.ingredient.id === ingU.ingredientId
            );

             if(matchingStore && matchingStore.usableLitresLeft ==0){
                issues.push(`"${matchingStore.ingredient.name}" usage (${ingU.litresUsed}L) exceeds available (${matchingStore.usableLitresLeft}L)`);
                isValid = false;
            }
            if (matchingStore && ingU.litresUsed > matchingStore.usableLitresLeft) {
                issues.push(`"${matchingStore.ingredient.name}" usage (${ingU.litresUsed}L) exceeds available (${matchingStore.usableLitresLeft}L)`);
                isValid = false;
            }


        });

        if (!isValid) {
            setMessage(issues.join('\n'));
        } else {
            setMessage(null);
        }

        return isValid;
    };

    const handleCreate = async () => {
        setLoading(true);
        if (!handleCheck()) {
            setLoading(false);
            return;
        }

        // Proceed if valid
        if (selectedProduction && selectedProduction.id && selectedProductId) {
            const s = {
                ...productMix,
                productionId: selectedProduction.id,
                productId: selectedProductId,
                totalLitersUsed: calculatedTotalIngredientUsage()
            };

            console.log("Creating product mix here : " ,s);
            const { data, status,message } = await createProductMix(selectedProduction.id, s);
            setSuccessMessage(message,status);
            setProductMix({
                ...productMix,
                totalLitersUsed:0,
                productMixIngredients:[]
            });
            console.log( data,"After saving, ");

            if (status) {
                onSaveProductMix(data.productMix,data.productionStore);
            }
        }
        setLoading(false);
    };


    const handleUpdate = async ()=> {
        setLoading(true);
        if (selectedProduction && selectedProduction.id && selectedProductId) {
            console.log("In here...  ", selectedProductId);
            const s = {...productMix,
                productionId: selectedProduction.id,
                productId: selectedProductId,
                totalLitersUsed:calculatedTotalIngredientUsage()
            };
            const {data,status} = await updateProductMix(selectedProduction.id,s);
            if(status){
                console.log("updated..")
                setProductMix(data);
            }
        }
        setLoading(false);
    }

    const calculatedTotalIngredientUsage = () => {
        if (productMix.productMixIngredients) {
            return productMix.productMixIngredients.reduce(
                (total, ingredient) => total + (ingredient.litresUsed || 0),
                0
            );
        }
        return 0;
    };


    const handleCall = async ()=> {
        if(productMix.id && productMix.id>0){
            handleCheck();
            handleUpdate();
        }else{
            handleCheck();
            handleCreate();
        }

    }




    return (

             <div>
                 { products && products.length > 0 ?
                     (
                         <>
                             <div className={"flex w-full gap-10 text-center"}>
                                 {/* Product Field */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Product Name</h1>
                                     <ProductSelector
                                         products={products}
                                         selectedProductId={ selectedProductId ?? undefined}
                                         disabled={!onEdit}
                                         onSelect={(productId) => setSelectedProductId(productId)}
                                     />
                                 </div>

                                 {/* Ingredients */}
                                 <div className="space-y-5">
                                     <div className="grid grid-cols-3 font-medium text-center gap-5">
                                         <h1>Ingredients</h1>
                                         <h1>Available</h1>
                                         <h1>Litre Used</h1>
                                     </div>

                                     {ingredients.map((ing, index) => (
                                         <div key={index} className="grid grid-cols-3 items-center gap-5 mb-2 text-center">
                                             <TextField
                                                 props={{ disabled: !onEdit }}
                                                 className="max-w-40 mx-auto"
                                                 value={ing.name ?? ""}
                                             />

                                             <div className="w-full border py-1 border-gray-300 rounded-xs px-2">
                                                 {selectedProduction?.productionStore?.ingredientStores.find(val => val.ingredient.id === ing.id)?.usableLitresLeft ?? '-'}
                                             </div>

                                             <TextField
                                                 props={{ disabled: !onEdit }}
                                                 className="max-w-40 mx-auto"
                                                 type={"number"}
                                                 placeholder={`Litres Used ${index + 1}`}
                                                 value={productMix.productMixIngredients?.find(u => u.ingredientId === ing.id)?.litresUsed??0}
                                                 onChange={(value) => {
                                                     const litres = parseFloat(value);

                                                     setProductMix(prev => {
                                                         const existingUsages = [...(prev.productMixIngredients ?? [])];
                                                         const usageIndex = existingUsages.findIndex(u => u.ingredientId === ing.id);
                                                         if (usageIndex !== -1) {
                                                             existingUsages[usageIndex].litresUsed = litres;
                                                         } else {
                                                             if (ing.id) {
                                                                 existingUsages.push({
                                                                     ingredientId: ing.id,
                                                                     litresUsed: litres,
                                                                     ingredient:ing
                                                                 });
                                                             }
                                                         }
                                                         return {
                                                             ...prev,
                                                             productMixIngredients: existingUsages,
                                                         };
                                                     });

                                                 }}
                                             />
                                         </div>
                                     ))}
                                 </div>


                                 {/* Total Litres Used */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Total Litres {onEdit?"":""}</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: true}}
                                         value={calculatedTotalIngredientUsage()??0}
                                         className={"max-w-40 text-center"}
                                     />
                                 </div>



                                 {/* Brix No Diluent */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Brix No Diluent</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.brixOnDiluent}
                                         className={"max-w-40 text-center"}
                                         placeholder={"brix no diluent"}
                                         onChange={value => {
                                             setProductMix({...productMix, brixOnDiluent: parseFloat(value)});
                                         }}
                                     />
                                 </div>

                                 {/* Initial Brix */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Initial Brix</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.initialBrix}
                                         className={"max-w-40 text-center"}
                                         placeholder={"initial brix"}
                                         onChange={value => {
                                             setProductMix({...productMix, initialBrix: parseFloat(value)});
                                         }}
                                     />
                                 </div>

                                 {/* Final Brix */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Final Brix</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.finalBrix}
                                         className={"max-w-40 text-center"}
                                         placeholder={"final brix"}
                                         onChange={value => {
                                             setProductMix({...productMix, finalBrix: parseFloat(value)});
                                         }}
                                     />
                                 </div>

                                 {/* Initial pH */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Initial pH</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.initialPH}
                                         className={"max-w-40 text-center"}
                                         placeholder={"initial ph"}
                                         onChange={value => {
                                             setProductMix({...productMix, initialPH: parseFloat(value)});
                                         }}
                                     />
                                 </div>

                                 {/* Final pH */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Final pH</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.finalPH}
                                         className={"max-w-40 text-center"}
                                         placeholder={"final ph"}
                                         onChange={value => {
                                             setProductMix({...productMix, finalPH: parseFloat(value)});
                                         }}
                                     />
                                 </div>


                                 {/* Final pH */}
                                 <div className={"space-y-5 font-medium"}>
                                     <h1>Product Count</h1>
                                     <TextField
                                         type={"number"}
                                         props={{ disabled: !onEdit }}
                                         value={productMix.productCount}
                                         className={"max-w-40 text-center"}
                                         placeholder={"product count"}
                                         onChange={value => {
                                             setProductMix({...productMix, productCount: parseFloat(value)});
                                         }}
                                     />
                                 </div>




                             </div>
                             { (
                                 <div className={"flex justify-end gap-4 pr-10 mt-5"}>
                                     {onEdit && <button
                                         className={`text-sm px-3 py-2 rounded flex items-center gap-2 transition ${
                                             loading
                                                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                 : productMix.id && productMix.id > 0
                                                     ? "bg-gray-400 hover:bg-gray-500 text-black"
                                                     : "bg-blue-500 hover:bg-blue-600 text-white"
                                         }`}

                                         type="submit" onClick={() => {
                                         handleCall();
                                     }}>

                                         <RotateCw className="h-5 w-5" />
                                         {/*{!onEdit? "Update":"Submit" }*/}
                                         Submit

                                     </button>}

                                     {/*{
                                    productMix.id && productMix.id > 0 &&  <button
                                        className={`text-sm px-3 py-2 rounded flex items-center gap-2 transition ${
                                            loading
                                                ? "bg-red-300 text-white cursor-not-allowed"
                                                : productMix.id && productMix.id > 0
                                                    ? "bg-red-400 hover:bg-red-600 text-white"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                        }`}

                                        type="submit" onClick={() => {
                                        deletePM();
                                    }}>
                                        <TrashIcon className="h-5 w-5" />
                                        {loading?"processing...":"Delete"}
                                    </button>

                                }*/}


                                 </div>
                             )}
                         </>
                     ):<div>

                     </div>

                 }

                 {message &&  <div>
                     <p className={"text-red-500"}>{message}</p>
                 </div>}
             </div>


    );
};
