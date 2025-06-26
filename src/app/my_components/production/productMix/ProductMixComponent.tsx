import {TextField} from "@/app/my_components/TextField";
import {RotateCw} from "lucide-react";
import React, {useMemo, useState} from "react";
import {useProductStore} from "@/app/store/productStore";
import {useProductionStore} from "@/app/store/productionStore";
import {ProductSelector} from "@/app/my_components/production/productMix/ProductSelector";
import {createProductMix} from "@/api/productMix";
import {ProductMix} from "@/app/types";
import {useLoadingUI} from "@/app/store/useLoadingUI";
import {disabled, ProductMixComponentProps} from "@/app/my_components/production/productMix/ProductMixPage";

export const ProductMixComponent = ({onSaveProductMix}: ProductMixComponentProps) => {
    const [productMix, setProductMix] = useState<ProductMix>({} as ProductMix);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const {selectedProduction} = useProductionStore();
    const {products} = useProductStore();
    const [message, setMessage] = useState<string | null>(null);
    const {setLoading, loading, setSuccessMessage} = useLoadingUI();

    const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);
    const ingredients = selectedProduct?.ingredients || [];

    const calculatedTotalIngredientUsage = () =>
        productMix.productMixIngredients?.reduce((total, i) => total + (i.litresUsed || 0), 0) || 0;


    const validateInputs = (): boolean => {
        let isValid = true;
        const issues: string[] = [];

        const requiredFields = {
            brixOnDiluent: productMix.brixOnDiluent,
            initialBrix: productMix.initialBrix,
            finalBrix: productMix.finalBrix,
            initialPH: productMix.initialPH,
            finalPH: productMix.finalPH,
            productCount: productMix.productCount
        };

        if (!productMix.productMixIngredients || productMix.productMixIngredients.length === 0) {
            issues.push("Litres used cannot be empty.");
            isValid = false;
        } else {
            productMix.productMixIngredients.forEach((ingU) => {
                const store = selectedProduction?.productionStore?.ingredientStores.find(
                    ingS => ingS.ingredient.id === ingU.ingredientId
                );

                if (store && (ingU.litresUsed > store.usableLitresLeft || !ingU.litresUsed)) {
                    issues.push(
                        `"${store.ingredient.name}" usage (${isNaN(ingU.litresUsed) ? 0 : ingU.litresUsed}L) must be or within (${store.usableLitresLeft}L)`
                    );
                    isValid = false;
                }
            });
        }

        const missingFields = Object.entries(requiredFields)
            .filter(([, value]) => value === undefined || value === null)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            issues.push(`Missing fields: ${missingFields.join(", ")}`);
            isValid = false;
        }

        setMessage(isValid ? null : issues[0]);
        return isValid;
    };

    const handleCreate = async () => {
        setLoading(true);
        if (!validateInputs()) {
            setLoading(false);
            return;
        }

        if (selectedProduction && selectedProduction.id && selectedProductId) {
            const payload = {
                ...productMix,
                productionId: selectedProduction.id,
                productId: selectedProductId,
                totalLitersUsed: calculatedTotalIngredientUsage()
            };

            const {data, status, message} = await createProductMix(selectedProduction.id, payload);
            setSuccessMessage(message, status);

            setProductMix({
                ...productMix,
                totalLitersUsed: 0,
                productMixIngredients: []
            });

            if (status && onSaveProductMix) {
                console.log("executing this...")
                onSaveProductMix(data.productMix, data.productionStore);
            }
        }
        setLoading(false);
    };

    const updateIngredientLitres = (ingredientId: number, litres: number) => {
        setProductMix(prev => {
            const ingredients = [...(prev.productMixIngredients || [])];
            const index = ingredients.findIndex(i => i.ingredientId === ingredientId);

            if (index !== -1) {
                ingredients[index].litresUsed = litres;
            } else {
                ingredients.push({ingredientId, litresUsed: litres, ingredient: {id: ingredientId, name: ""}});
            }

            return {...prev, productMixIngredients: ingredients};
        });
    };

    return (
        <div>
            {products && products.length > 0 && (
                <>
                    <div className="flex w-full gap-5 text-center">
                        <div className="space-y-5 font-medium">
                            <h1>Product Name</h1>
                            <ProductSelector
                                products={products}
                                selectedProductId={selectedProductId ?? undefined}
                                onSelect={setSelectedProductId}
                            />
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-3 font-medium text-center gap-5">
                                <h1>Ingredients</h1>
                                <h1>Available</h1>
                                <h1>Litre Used</h1>
                            </div>

                            {ingredients.map((ing, idx) => {
                                const val: number = selectedProduction?.productionStore?.ingredientStores.find(s => s.ingredient.id === ing.id)?.usableLitresLeft ?? 0
                                const litersUsed = productMix.productMixIngredients?.find(i => i.ingredientId === ing.id)?.litresUsed;
                                return <div key={idx} className="grid grid-cols-3 items-center gap-5 mb-2 text-center">
                                    <TextField className="max-w-40 mx-auto" value={ing.name ?? ""} props={disabled}/>
                                    <div className="w-full border py-1 border-gray-300 rounded-xs px-2">
                                        {val}
                                    </div>
                                    {val > 0 && <TextField
                                        className="max-w-40 mx-auto"
                                        type="number"
                                        placeholder={`Litres Used ${idx + 1}`}
                                        value={litersUsed}
                                        onChange={(val) => {
                                            if (ing.id) {
                                                updateIngredientLitres(ing.id, parseFloat(val))
                                            }
                                        }}
                                    />}
                                </div>
                            })}
                        </div>


                        {["brixOnDiluent", "initialBrix", "finalBrix", "initialPH", "finalPH", "productCount"].map((field, i) => (
                            <div className="space-y-5 font-medium" key={i}>
                                <h1>{field.replace(/([A-Z])/g, " $1").trim()}</h1>
                                <TextField
                                    type="number"
                                    value={(productMix as never)[field]}
                                    className="max-w-40 text-center"
                                    placeholder={field}
                                    onChange={val => setProductMix({...productMix, [field]: parseFloat(val)})}
                                />
                            </div>
                        ))}
                    </div>

                    {message && <p className="text-red-500 mt-4 font-bold">{message}</p>}

                    <button onClick={handleCreate} className="mt-6 bg-sky-700 p-2 rounded-sm text-white">
                        {loading ? <RotateCw className="animate-spin"/> : "Save Product Mix"}
                    </button>
                </>
            )}
        </div>
    );
};
