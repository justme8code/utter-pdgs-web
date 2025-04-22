import { Product } from "@/app/product";

// ProductSelector.tsx
export const ProductSelector = ({ products, selectedProductId, disabled, onSelect }: {
    products: Product[];
    selectedProductId?: number;
    disabled: boolean;
    onSelect: (productId: number) => void;
}) => {
    const selected = products.find(p => p.id === selectedProductId);

    if (disabled) {
        return <input disabled value={selected?.name || ""} className="max-w-40 border px-2 py-1" />;
    }

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