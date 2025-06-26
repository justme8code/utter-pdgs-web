import React from 'react';
import {ConversionField} from "@/app/types";


//  Read-only Conversion prod_components
export const ReadonlyConversion = ({
                                       field,
                                       showLabel = true,
                                   }: {
    field: ConversionField;
    showLabel?: boolean;
}) => {


    const renderField = (
        label: string,
        value: number | string | undefined,
        readOnly = true,
    ) => {
        const formattedValue = value !== undefined && value !== null ? (typeof value === "number" ? value.toFixed(2) : value) : '0.00';
        return (
            <div className="mb-4">
                {showLabel && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
                <input
                    disabled={readOnly}
                    className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1 max-w-32"
                    value={formattedValue}
                    readOnly={readOnly}
                />
            </div>
        );
    };


    return (
        <div className="flex items-center justify-end gap-2">
            {renderField('Ingredient', field.ingredient?.name, true)}
            {renderField('Kg Used', field.kgUsed, true)}
            {renderField('Output Litres', field.outPutLitres, true)}
            {renderField('PLitersLost', field.productionLitresLost, true)}
            {renderField('Usable Litres', field.usableLitres, true)}
            {renderField('Litres/Kg(auto)', field.litresPerKg, true)}
            {renderField('₦ Cost/Litre', field.costPerLitre, true)}
            {renderField('Raw Brix', field.rawBrix, true)}
        </div>
    );
};
