// app/your-path/ProductsPage.tsx
'use client';

import {ProductCard} from "./ProductCard";
import {CreateAProductButton} from "@/app/my_components/production/CreateAProductButton"; // Assuming this is styled or a Shadcn button
import {useProductStore} from "@/app/store/productStore";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input"; // For potential search later
import {LayoutGrid, Loader2, PackageSearch, Search} from "lucide-react";
import {Navbar} from "@/components/layout/Navbar"; // Icons

export default function ProductsPage() {
    const {products, fetchProducts} = useProductStore();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // For future search functionality

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            await fetchProducts();
            setIsLoading(false);
        };
        loadProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            {/* Header and Actions */}
            <Navbar title={"Product Templates"} icon={<LayoutGrid className="h-6 w-6 text-primary"/>}>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                    <CreateAProductButton/> {/* Ensure this is styled or replace with <Button> */}
                </div>
            </Navbar>

            {/* Product Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4"/>
                    <p className="text-lg font-medium">Loading Product Templates...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 col-span-full bg-card border-2 border-dashed rounded-lg">
                    <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground/70"/>
                    <h3 className="mt-4 text-xl font-semibold text-muted-foreground">No Product Templates Found</h3>
                    {searchTerm ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {`No products match your search for \"${searchTerm}\" Try a different term or create a new`}
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Get started by creating a new product template.
                        </p>
                    )}

                </div>
            )}
        </div>
    );
}