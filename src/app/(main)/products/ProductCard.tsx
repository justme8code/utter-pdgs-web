// app/your-path/ProductCard.tsx
import {Box, Layers, ListChecks} from "lucide-react"; // Using Package or Box as a more generic product icon
import {Product} from "@/app/types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button"; // If you want to style the button

export const ProductCard = ({product}: { product: Product }) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <CardHeader className="pb-3 pt-5">
                <div className="flex justify-center mb-3">
                    {/* Using a more generic product icon */}
                    <Box className="w-16 h-16 text-primary/70"/>
                </div>
                <CardTitle className="text-lg leading-tight text-center truncate" title={product.name}>
                    {product.name}
                </CardTitle>
                {product.description && (
                    <CardDescription className="text-xs text-center h-8 overflow-hidden text-ellipsis">
                        {product.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="flex-grow space-y-3 text-sm">
                {product.unitOfMeasure && (
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <span>Unit: <span className="font-medium text-foreground">{product.unitOfMeasure}</span></span>
                    </div>
                )}

                {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                        <Separator className="my-2"/>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                            <ListChecks className="h-3.5 w-3.5"/>
                            Standard Ingredients:
                        </h4>
                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar pr-1">
                            {product.ingredients.map((ingredient) => (
                                <Badge key={ingredient.id} variant="outline" className="text-xs px-1.5 py-0.5">
                                    {ingredient.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 mt-auto">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                    <Layers className="mr-1.5 h-3.5 w-3.5"/>
                    {product.totalProductMixCount || 0} Mixes
                </Button>
                {/* You could add an "Edit" or "View Details" button here too */}
                {/* <Button variant="outline" size="sm" className="w-full">View Details</Button> */}
            </CardFooter>
        </Card>
    );
};