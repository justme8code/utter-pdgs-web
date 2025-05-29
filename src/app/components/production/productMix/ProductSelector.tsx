
// ProductSelector.tsx
import {Product} from "@/app/types";

export const ProductSelector = ({ products, selectedProductId,onSelect }: {
    products: Product[];
    selectedProductId?: number;
    onSelect: (productId: number) => void;
}) => {


    return (
        <select
            value={selectedProductId ?? ""}
            onChange={(e) => {
                console.log(e.target.value);
                onSelect(Number(e.target.value))
            }}
            className="max-w-40 border px-2 py-1"
        >
            <option value="" disabled={true}>Select product</option>
            {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
            ))}
        </select>
    );
};