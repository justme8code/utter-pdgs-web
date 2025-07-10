// FILE: @/components/production/NewEditableConversionRow.tsx

import React, { useState, useEffect } from "react";
import { ConversionField, Ingredient, Purchase } from "@/app/types";
import { calculateCostPerLitre, calculateLitresPerKg } from "@/app/utils/production-computing-formulas";
import { checkNan } from "@/app/utils/functions";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils"; // Make sure you have this utility from shadcn

// New, specific props for this component
type NewEditableConversionRowProps = {
    ingredient: Ingredient;
    purchase: Purchase;
    // The specific field data for this row from the parent's state
    fieldData: ConversionField;
    onFieldChange: (ingredientId: number, updatedField: ConversionField) => void;
};

type EditableFieldKey = Exclude<keyof ConversionField, 'ingredient' | 'id'>;

// A type for the fields we allow direct user input on
type EditableNumericField = 'kgUsed' | 'outPutLitres' | 'productionLitresLost' | 'rawBrix';

type UserInputField = 'kgUsed' | 'outPutLitres' | 'productionLitresLost' | 'rawBrix';


export const NewEditableConversionRow: React.FC<NewEditableConversionRowProps> = ({
                                                                                      ingredient,
                                                                                      purchase,
                                                                                      fieldData,
                                                                                      onFieldChange,
                                                                                  }) => {
    // This local state manages the inputs for this row.
    // It's synced with the parent's state via the `useEffect` below.
    const [formData, setFormData] = useState<ConversionField>(fieldData);

    useEffect(() => {
        setFormData(fieldData);
    }, [fieldData]);

    const handleChange = (fieldKey: EditableNumericField, value: string) => {
        // Start with a copy of the current form data
        const updatedFormData = { ...formData };

        // Parse the input value, allowing it to be empty/undefined
        const parsedValue = value === '' ? undefined : parseFloat(value);
        updatedFormData[fieldKey] = isNaN(parsedValue ?? NaN) ? undefined : parsedValue;

        // --- Your existing, proven calculation logic ---
        const out = parseFloat(checkNan(updatedFormData.outPutLitres));
        const lost = parseFloat(checkNan(updatedFormData.productionLitresLost));
        const usable = out - lost;

        updatedFormData.usableLitres = isNaN(usable) ? undefined : usable.toFixed(2);

        const costPerLitre = calculateCostPerLitre({
            totalCost: checkNan(purchase.cost),
            usableLitres: usable,
        });
        updatedFormData.costPerLitre = costPerLitre?.toFixed(2);

        const litresPerKg = calculateLitresPerKg({
            usableLitres: usable,
            totalUsable: checkNan(updatedFormData.kgUsed),
        });
        updatedFormData.litresPerKg = litresPerKg?.toFixed(2);
        // --- End of your logic ---

        setFormData(updatedFormData);

        if (ingredient.id) {
            onFieldChange(ingredient.id, updatedFormData);
        }
    };

    const renderInput = (
        fieldKey: EditableFieldKey,
        isEditable: boolean = false,
        placeholder: string = '0.00'
    ) => (
        <Input
            type="number"
            readOnly={!isEditable}
            // This is now type-safe! `formData[fieldKey]` can no longer be an Ingredient object.
            value={formData[fieldKey] ?? ''}
            onChange={isEditable ? (e) => handleChange(fieldKey as UserInputField, e.target.value) : undefined}
            placeholder={placeholder}
            className={cn("text-center", !isEditable && "bg-gray-100 dark:bg-gray-800 cursor-not-allowed")}
        />
    );

    return (
        <div className="grid grid-cols-8 items-center gap-3 py-2">
            <Input
                readOnly
                value={ingredient.name}
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-center"
            />
            {renderInput('kgUsed', true)}
            {renderInput('outPutLitres', true, `Output (${ingredient.uom})`)}
            {renderInput('productionLitresLost', true, 'Litres Lost')}
            {renderInput('usableLitres', false, `Usable (${ingredient.uom})`)}
            {renderInput('litresPerKg', false, 'Litres/Kg')}
            {renderInput('costPerLitre', false, `Cost/${ingredient.uom}`)}
            {renderInput('rawBrix', true)}
        </div>
    );
};