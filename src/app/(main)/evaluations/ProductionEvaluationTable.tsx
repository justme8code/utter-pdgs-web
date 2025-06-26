// /app/features/production-evaluation/ProductEvaluationTable.tsx

import {Control, Controller, FieldArrayWithId} from 'react-hook-form';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {FormControl, FormField, FormItem} from '@/components/ui/form';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {TrashIcon} from '@radix-ui/react-icons';


import {CircleBox} from './CircleBox';
import {TasteBudFormData} from "@/lib/schema";

interface ProductEvaluationTableProps {
    control: Control<TasteBudFormData>;
    fields: FieldArrayWithId<TasteBudFormData, 'productEvaluations', 'id'>[];
    onRemoveProduct: (index: number) => void; // Function to remove a product
}

export const ProductEvaluationTable = ({control, fields, onRemoveProduct}: ProductEvaluationTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Evaluation</CardTitle>
                <CardDescription>{"Rate each product you've added based on the criteria below."}</CardDescription>
            </CardHeader>
            <CardContent>
                {fields.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No products added for evaluation yet.</p>
                        <p className="text-sm text-muted-foreground">Use the section above to add products.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[250px]">Product Title</TableHead>
                                    <TableHead className="text-center">Taste</TableHead>
                                    <TableHead className="text-center">After Taste</TableHead>
                                    <TableHead className="text-center">Viscosity</TableHead>
                                    <TableHead className="min-w-[200px]">Comments</TableHead>
                                    <TableHead className="min-w-[120px]">Release</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell
                                            className="font-medium">{field.title}-{field.productMixId}</TableCell>
                                        {/* ... (CircleBox and other form fields remain the same) ... */}
                                        {(['taste', 'afterTaste', 'viscosity'] as const).map((attr) => (
                                            <TableCell key={attr} className="text-center">
                                                <Controller
                                                    control={control}
                                                    name={`productEvaluations.${index}.${attr}`}
                                                    render={({field: {value, onChange}}) => (
                                                        <CircleBox value={value}
                                                                   onClick={() => onChange(value === "ACCEPTABLE" ? "UNACCEPTABLE" : value === "UNACCEPTABLE" ? undefined : "ACCEPTABLE")}/>
                                                    )}
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <FormField control={control} name={`productEvaluations.${index}.comments`}
                                                       render={({field}) => (
                                                           <FormItem><FormControl><Textarea
                                                               placeholder="Your comments..." {...field} /></FormControl></FormItem>
                                                       )}/>
                                        </TableCell>
                                        <TableCell>
                                            <FormField control={control} name={`productEvaluations.${index}.release`}
                                                       render={({field}) => (
                                                           <Select onValueChange={field.onChange}
                                                                   defaultValue={field.value}>
                                                               <FormControl><SelectTrigger><SelectValue
                                                                   placeholder="Select..."/></SelectTrigger></FormControl>
                                                               <SelectContent><SelectItem
                                                                   value="Yes">Yes</SelectItem><SelectItem
                                                                   value="No">No</SelectItem></SelectContent>
                                                           </Select>
                                                       )}/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button type="button" variant="ghost" size="icon"
                                                    onClick={() => onRemoveProduct(index)}>
                                                <TrashIcon className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};