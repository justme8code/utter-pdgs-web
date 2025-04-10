import { Modal } from "@/app/components/Modal";
import { useState, useEffect } from "react";
import { TextField } from "@/app/components/TextField";
import { Button } from "@/app/components/Button";
import { useProductForm } from "@/app/hooks/useProductForm";
import { ModalOnAction } from "@/app/productions/CreateProduction";
import { useProductStore } from "@/app/store/productStore";

export const CreateProduct = ({ onClose, isOpen }: ModalOnAction) => {
    const {
        productDetails,
        variantDetails,
        handleProductChange,
        handleVariantChange,
        resetForm,
        isValid,
    } = useProductForm();

    const { addProduct, isLoading, error } = useProductStore();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleCreateNewProduct = async () => {
        if (!isValid()) {
            setSuccessMessage(null);
            return;
        }

        const payload = {
            ...productDetails,
            variant: variantDetails,
        };

        await addProduct(payload);

        if (!error) {
            setSuccessMessage("Product created successfully!");
            resetForm();
            onClose?.();
        }
    };

    // Clear success message on open
    useEffect(() => {
        if (isOpen) {
            setSuccessMessage(null);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen ?? false} onClose={() => onClose && onClose()}>
            <div className="flex flex-col space-y-4 w-96 text-black">
                <h1 className="font-bold text-2xl mx-auto">Create New Product</h1>
                <div className="border-b border-gray-300 w-full mb-5" />

                <TextField
                    value={productDetails.name}
                    label="Product Name"
                    onChange={(value) => handleProductChange("name", value)}
                    props={{ placeholder: "Enter product name" }}
                />

                <TextField
                    value={productDetails.description}
                    label="Product Description"
                    onChange={(value) => handleProductChange("description", value)}
                    props={{ placeholder: "Please describe the product" }}
                />

                <TextField
                    value={productDetails.unitOfMeasure}
                    label="Unit of Measure"
                    onChange={(value) => handleProductChange("unitOfMeasure", value)}
                    props={{ placeholder: "e.g., kg, piece, liter" }}
                />

                <TextField
                    value={productDetails.category}
                    label="Category"
                    onChange={(value) => handleProductChange("category", value)}
                    props={{ placeholder: "Enter product category" }}
                />

                <h2 className="font-semibold text-lg mt-4">Product Variant</h2>

                <TextField
                    value={variantDetails.name}
                    label="Variant Name"
                    onChange={(value) => handleVariantChange("name", value)}
                    props={{ placeholder: "Enter variant name (e.g., Standard)" }}
                />

                <TextField
                    value={variantDetails.description}
                    label="Variant Description"
                    onChange={(value) => handleVariantChange("description", value)}
                    props={{ placeholder: "Describe this variant" }}
                />

                <Button
                    label={isLoading ? "Creating..." : "Create Product"}
                    onClick={handleCreateNewProduct}
                    className="max-w-fit mx-auto"
                    disabled={isLoading}
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
        </Modal>
    );
};
