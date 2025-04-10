// hooks/useProductForm.ts
import { useState } from "react";
import {ProductPayload, VariantPayload} from "@/app/product";


export const useProductForm = () => {
  const [productDetails, setProductDetails] = useState<Omit<ProductPayload, 'variant'>>({
    name: "",
    description: "",
    unitOfMeasure: "",
    category: "",
  });

  const [variantDetails, setVariantDetails] = useState<VariantPayload>({
    name: "",
    description: "",
  });

  const handleProductChange = (
    field: keyof Omit<ProductPayload, 'variant'>,
    value: string
  ) => {
    setProductDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVariantChange = (field: keyof VariantPayload, value: string) => {
    setVariantDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setProductDetails({
      name: "",
      description: "",
      unitOfMeasure: "",
      category: "",
    });

    setVariantDetails({
      name: "",
      description: "",
    });
  };

  const isValid = () => {
    const { name, description, unitOfMeasure, category } = productDetails;
    const { name: variantName, description: variantDesc } = variantDetails;
    return !!(name && description && unitOfMeasure && category && variantName && variantDesc);
  };

  return {
    productDetails,
    variantDetails,
    handleProductChange,
    handleVariantChange,
    resetForm,
    isValid,
  };
};
