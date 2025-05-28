import React, { useState} from "react";
import { Conversion, ConversionField, Ingredient, Purchase } from "@/app/types";
import {
    calculateCostPerLitre,
    calculateLitresPerKg
} from "@/app/utils/production-computing-formulas";
import { checkNan } from "@/app/utils/functions";

type ConversionFieldKeys = keyof ConversionField;
type ConversionFieldValues = ConversionField[ConversionFieldKeys];

type NumericFieldKey =
    | 'kgUsed'
    | 'usableLitres'
    | 'outPutLitres'
    | 'productionLitresLost'
    | 'costPerLitre'
    | 'rawBrix'
    | 'litresPerKg';


//  Simplified EditableConversion component
export const EditableConversion = ({
                                ingredient,
                                showLabel = true,
                                purchase,
                                conversion,
                                onFieldChange,
                            }: {
    ingredient: Ingredient;
    showLabel?: boolean;
    purchase: Purchase;
    conversion: Conversion;
    onFieldChange: (ingredientId: number, updatedField: ConversionField) => void;
}) => {
    const field = conversion.fields.find((f) => f.ingredient?.id === ingredient.id) || {
        id: null,
        kgUsed: undefined,
        usableLitres: undefined,
        outPutLitres: undefined,
        productionLitresLost: undefined,
        costPerLitre: undefined,
        rawBrix: undefined,
        litresPerKg: undefined,
        ingredient:ingredient,
    };
    const [formData, setFormData] = useState<ConversionField>(field);


    const handleChange = (fieldKey: keyof ConversionField, value: ConversionFieldValues) => {
        const updatedFormData = { ...formData };

        if ((['outPutLitres', 'productionLitresLost', 'rawBrix', 'kgUsed'] as string[]).includes(fieldKey)) {
           if(value){
               const parsedValue = value === '' ? undefined : parseFloat(value.toString());
               (updatedFormData as Record<NumericFieldKey, number | undefined>)[fieldKey as NumericFieldKey] = isNaN(parsedValue??NaN) ? undefined : parsedValue;
           }
        }

        const out =  parseFloat(checkNan(updatedFormData.outPutLitres));
        const lost =  parseFloat(checkNan(updatedFormData.productionLitresLost));
        const usable =  (out - lost);

        updatedFormData.usableLitres = usable.toFixed(2);
        updatedFormData.costPerLitre = calculateCostPerLitre({
            totalCost: checkNan(purchase.cost),
            usableLitres: usable,
        });

        updatedFormData.litresPerKg = calculateLitresPerKg({
            usableLitres: usable,
            totalUsable: checkNan(updatedFormData.kgUsed), // Use kgUsed from store
        });

        // Optional: Format the values to keep a consistent decimal format
        updatedFormData.costPerLitre = updatedFormData.costPerLitre?.toFixed(2);  // Adjust decimal places as needed
        updatedFormData.litresPerKg = updatedFormData.litresPerKg?.toFixed(2);    // Adjust decimal places as needed


        setFormData(updatedFormData);
        updatedFormData.kgUsed = parseFloat(updatedFormData.kgUsed as string).toFixed(2);
        updatedFormData.outPutLitres = parseFloat(updatedFormData.outPutLitres as string).toFixed(2);
        updatedFormData.productionLitresLost = parseFloat(updatedFormData.productionLitresLost as string).toFixed(2);
        updatedFormData.rawBrix = parseFloat(updatedFormData.rawBrix as string).toFixed(2);

        if(ingredient.id){
            onFieldChange(ingredient.id, updatedFormData);
        }
    };

    const renderField = (
        label: string,
        value: number | string | undefined,
        fieldKey?: keyof ConversionField,
        readOnly = false,
        type?:string
    ) => (
        <div className="mb-4">
            {showLabel && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
            <input
                className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1 max-w-28"
                defaultValue={value ?? ''}
                type={type??"number"}
                readOnly={readOnly}
                onChange={
                    !readOnly && fieldKey
                        ? (e) => handleChange(fieldKey,parseFloat(e.target.value))
                        : undefined
                }
            />
        </div>
    );

    return (
        <div className="flex items-center justify-end gap-2">
            {renderField('Ingredient', formData.ingredient?.name, "ingredient", true,"text")}
            {renderField('Kg Used', formData.kgUsed, "kgUsed")}
            {renderField('Output (l) | (kg)', formData.outPutLitres, 'outPutLitres')}
            {renderField('PLitersLost', formData.productionLitresLost, 'productionLitresLost')}
            {renderField('Usable (l) | (kg)', formData.usableLitres, undefined, true)}
            {renderField('Litres/Kg(auto)', formData.litresPerKg, undefined, true)}
            {renderField('₦ Cost (l) | (kg)', formData.costPerLitre, undefined, true)}
            {renderField('Raw Brix', formData.rawBrix, 'rawBrix')}
        </div>
    );
}