'use client';
import {Modal} from "@/app/components/Modal";
import {useEffect, useState} from "react";
import {TextField} from "@/app/components/TextField";
import {ModalOnAction} from "@/app/components/production/CreateProduction";
import {useProductStore} from "@/app/store/productStore";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/app/components/Button";
import {useIngredientStore} from "@/app/store/ingredientStore";
import {Ingredient} from "@/app/components/inventory/RawMaterials";

// Define Zod schema
const productSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters").nonempty("Product name is required"),
    description: z.string().max(100, "Description must be at most 100 characters").nonempty("Description is required"),
    unitOfMeasure: z.string().nonempty("Unit of measure is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const CreateProduct = ({ onClose, isOpen }: ModalOnAction) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {addProduct,error,isLoading} = useProductStore();
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const {ingredients,fetchIngredients} = useIngredientStore();

    const { control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            unitOfMeasure: "",
        },
    });

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleCreateNewProduct = async (data: ProductFormValues) => {
        // Call the product store to create a new product
         await addProduct({
            name: data.name,
            description: data.description,
            unitOfMeasure: data.unitOfMeasure,
            ingredients: selectedIngredients,
        });
        if (!error) {
            setSuccessMessage("Product created successfully!");
            onClose?.();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSuccessMessage(null);
        }
    }, [isOpen]);

    const ErrorMessage = ({ message }: { message: string | undefined }) => (
        <p className="text-red-500 text-sm">{message}</p>
    );

    return (
        <Modal isOpen={isOpen ?? false} onClose={() => onClose && onClose()}>
            <form onSubmit={handleSubmit(handleCreateNewProduct)} className={""}>
                <div className="flex flex-col justify-between space-y-4 w-96 p-2  text-black">
                     <div className={"space-y-5 w-full"}>
                         <h1 className="font-bold text-2xl mx-auto">Create New Product</h1>
                         <div className="border-b border-gray-300 w-full mb-5" />

                         <Controller
                             name="name"
                             control={control}
                             render={({ field }) => (
                                 <div>
                                     <TextField
                                         {...field}
                                         label="Product Name"
                                         placeholder="Enter product name"
                                         type="text"
                                         className="w-full"
                                     />
                                     <ErrorMessage message={errors.name?.message}/>
                                 </div>
                             )}
                         />

                         <Controller
                             name="description"
                             control={control}
                             render={({ field }) => (
                                 <div>
                                     <TextField
                                         {...field}
                                         label="Product Description"
                                         placeholder="Enter product description"
                                         type="text"
                                         className="w-full"
                                     />
                                     <ErrorMessage message={errors.description?.message}/>
                                 </div>
                             )}
                         />

                         <Controller
                             name="unitOfMeasure"
                             control={control}
                             render={({ field }) => (

                                 <div>
                                     <TextField
                                         {...field}
                                         label="Unit of Measure"
                                         placeholder="Enter unit of measure"
                                         type="text"
                                         className="w-full"
                                     />
                                     <ErrorMessage message={errors.unitOfMeasure?.message}/>
                                 </div>
                             )}
                         />

                     </div>

                    <div className="flex w-full">
                        {ingredients.map((ingredient) => (
                            <label key={ingredient.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-full text-blue-600"
                                    checked={selectedIngredients.some((i) => i.id === ingredient.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIngredients((prev) => [...prev, ingredient]);
                                        } else {
                                            setSelectedIngredients((prev) =>
                                                prev.filter((i) => i.id !== ingredient.id)
                                            );
                                        }
                                    }}
                                />
                                <span>{ingredient.name}</span>
                            </label>
                        ))}
                    </div>
                    <Button label={isLoading ? "Creating..." : "Create Product"}
                            disabled={isLoading}
                            type={"submit"}
                    />

                    {successMessage && (
                        <div className="text-green-500 text-center text-sm font-bold">{successMessage}</div>
                    )}

                    {error && (
                        <div className="bg-gray-200 w-full rounded-sm p-3">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
                </div>
            </form>
        </Modal>
    );
};