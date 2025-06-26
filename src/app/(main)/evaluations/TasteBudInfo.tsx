'use client';

import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {CalendarIcon} from '@radix-ui/react-icons';

// Assuming you have these components from your project
import {Navbar} from '@/components/layout/Navbar';
import {cn} from '@/lib/utils'; // Standard shadcn/ui utility
// shadcn/ui Component Imports
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Textarea} from '@/components/ui/textarea';
import useAuthStore from "@/app/store/useAuthStore";
import {useEffect, useState} from "react";
import {fetchProduction} from "@/api/production";
import {Production} from "@/app/types";

// --- Schema and Type Definitions ---

// Updated schema to use z.date() for better type safety with the Calendar component
const tasteBudSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    batchRange: z.string().min(1, 'Batch range is required'),
    manufacturingDate: z.date({
        required_error: 'A manufacturing date is required.',
    }),
    expiryDate: z.date({
        required_error: 'An expiry date is required.',
    }),
    products: z.array(
        z.object({
            title: z.string(),
            taste: z.number().optional(),
            afterTaste: z.number().optional(),
            viscosity: z.number().optional(),
            comments: z.string().optional(),
            release: z.string().optional(),
        }),
    ),
});

type TasteBudFormData = z.infer<typeof tasteBudSchema>;

// Default product list remains the same
const defaultProducts = [
    {title: 'Watermelon and pineapple', comments: '', release: ''},
    {title: 'Carrot and pineapple with ginger', comments: '', release: ''},
    {title: 'Mango', comments: '', release: ''},
    {title: 'Pineapple', comments: '', release: ''},
    {title: 'Pineapple and ginger', comments: '', release: ''},
    {title: 'Pineapple and Coconut', comments: '', release: ''},
];

// --- Custom Sub-components ---

interface CircleBoxProps {
    value?: number;
    onClick: () => void;
}

// Re-styled CircleBox to use shadcn/ui Button for better a11y and consistency
const CircleBox: React.FC<CircleBoxProps> = ({value, onClick}) => {

    const displayClass =
        value === 1 ? 'bg-green-500 hover:bg-green-600' :
            value === 2 ? 'bg-red-500 hover:bg-red-600' :
                '';

    return (
        <Button
            type="button" // Prevents form submission on click
            variant="outline"
            onClick={onClick}
            className="w-16 h-16 rounded-lg"
        >
            {value && (
                <div
                    className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-lg transition-colors',
                        displayClass,
                    )}
                >
                    {value}
                </div>
            )}
        </Button>
    );
};


// --- Main Component ---

export const TasteBudInfo = () => {
    const {auth} = useAuthStore();
    const [production, setProduction] = useState<Production | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const {data, status} = await fetchProduction(1);
            if (status && data) {
                setProduction(data);
            }
        }
        fetchData();
    })


    const form = useForm<TasteBudFormData>({
        resolver: zodResolver(tasteBudSchema),
        defaultValues: {
            name: '',
            batchRange: '',
            // Dates are now undefined by default, which works perfectly with the date picker's placeholder
            products: defaultProducts,
        },
    });

    const {fields} = useFieldArray({
        control: form.control,
        name: 'products',
    });

    const onSubmit = (data: TasteBudFormData) => {
        // You can process and send the data to your API here
        console.log(data);
        alert('Form submitted! Check the console for the data.');
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <Navbar title={"Production Evaluation"}/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section: Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Fill in the details for this evaluation batch.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Evaluator Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., John Doe" {...field}
                                                       value={auth?.user.fullName} disabled={true}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="batchRange"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Batch Range</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., BATCH-001-050" {...field}
                                                       value={`BATCH-1-BATCH ${production?.lastBatch}`}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manufacturingDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Manufacturing Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, 'PPP') :
                                                                <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value}
                                                              onSelect={field.onChange} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expiryDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Expiry Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, 'PPP') :
                                                                <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value}
                                                              onSelect={field.onChange} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section: Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                This evaluation is aimed at testing or checking the quality parameter of the juice
                                samples in other to make amends
                                where necessary using sensory evaluation, it will be done using the 2 point hedonic
                                scale. We employ you to pick the number that meets your perception of juice
                                samples as listed below.
                            </p>
                            <ul className="list-disc pl-5 font-medium">
                                <li><strong className="text-foreground">1:</strong> Acceptable</li>
                                <li><strong className="text-foreground">2:</strong> Unacceptable</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Section: Products Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Evaluation</CardTitle>
                            <CardDescription>Rate each product based on the criteria below.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell className="font-medium">{field.title}</TableCell>

                                                {(['taste', 'afterTaste', 'viscosity'] as const).map((attr) => (
                                                    <TableCell key={attr} className="text-center">
                                                        <Controller
                                                            control={form.control}
                                                            name={`products.${index}.${attr}`}
                                                            render={({field: {value, onChange}}) => (
                                                                <CircleBox
                                                                    value={value}
                                                                    onClick={() => {
                                                                        const newValue = value === 1 ? 2 : value === 2 ? undefined : 1;
                                                                        onChange(newValue);
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </TableCell>
                                                ))}

                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`products.${index}.comments`}
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Your comments..." {...field} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`products.${index}.release`}
                                                        render={({field}) => (
                                                            <Select onValueChange={field.onChange}
                                                                    defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select..."/>
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                                    <SelectItem value="No">No</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section: Submit */}
                    <div className="flex justify-end">
                        <Button type="submit" size="lg">
                            Submit Evaluation
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};