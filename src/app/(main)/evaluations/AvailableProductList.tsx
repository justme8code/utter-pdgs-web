// /app/features/production-evaluation/AvailableProductsList.tsx
'use client';

import {useEffect, useState} from 'react';
import {getProductMixOutputsLessDetails} from '@/api/productMix';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {PlusCircledIcon} from '@radix-ui/react-icons';
import {Skeleton} from '@/components/ui/skeleton';

// Define the shape of a single product from your API
interface AvailableProduct {
    id: number;
    productName: string;
}

// Define the props for the component
interface AvailableProductsListProps {
    productionId: number;
    onAddProduct: (product: { id: number, title: string }) => void;
    existingProductIds: number[];
}

export const AvailableProductsList = ({productionId, onAddProduct, existingProductIds}: AvailableProductsListProps) => {
    const [products, setProducts] = useState<AvailableProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Can't fetch if there's no ID yet
        if (!productionId) {
            setIsLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            const {data, status, message} = await getProductMixOutputsLessDetails(productionId);
            if (status && data) {
                setProducts(data);
            } else {
                setError(message || 'Failed to fetch available products.');
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, [productionId]); // Re-fetch if productionId changes

    return (
        <Card>
            <CardHeader>
                <CardTitle>Available Products in Production</CardTitle>
                <CardDescription>{"Click the '+' button to add a product to the evaluation table below."}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                {!isLoading && !error && (
                    <div className="space-y-2">
                        {products.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No products found for this production run.</p>
                        ) : (
                            products.map((product) => {
                                const isAlreadyAdded = existingProductIds.includes(product.id);
                                return (
                                    <div key={product.id}
                                         className="flex items-center justify-between p-2 border rounded-md">
                                        <span className="font-medium">{product.productName} - {product.id}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onAddProduct({id: product.id, title: product.productName})}
                                            disabled={isAlreadyAdded}
                                            aria-label={`Add ${product.productName} to evaluation`}
                                        >
                                            <PlusCircledIcon className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};