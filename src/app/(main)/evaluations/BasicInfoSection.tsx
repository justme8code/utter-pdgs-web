// /app/features/production-evaluation/BasicInfoSection.tsx
'use client';

import {Control} from 'react-hook-form';
import {format} from 'date-fns';
import {CalendarIcon} from '@radix-ui/react-icons';


import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Production} from '@/app/types';
import {TasteBudFormData} from "@/lib/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


interface BasicInfoSectionProps {
    control: Control<TasteBudFormData>;
    production: Production | null;

}

export const BasicInfoSection = ({control, production}: BasicInfoSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Fill in the details for this evaluation batch.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* --- ADD THE NEW FORM FIELD FOR EVALUATION TYPE --- */}
                    <FormField
                        control={control}
                        name="evaluationType"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Evaluation Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type..."/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="IN_PROCESS" disabled={production?.finalized}>
                                            In-Process
                                        </SelectItem>
                                        <SelectItem value="POST_PROCESS">Post-Process</SelectItem>
                                    </SelectContent>
                                </Select>
                                {production?.finalized && (
                                    <p className="text-sm text-muted-foreground">
                                        In-Process is disabled because production is finalized.
                                    </p>
                                )}
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Evaluator Name</FormLabel>
                                <FormControl>
                                    {/* DO NOT manually set value. Let RHF control it via {...field}. */}
                                    <Input
                                        placeholder="Loading..."
                                        {...field} // RHF controls the value
                                        readOnly
                                        className="bg-muted"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Batch Range Field - CORRECTED */}
                    <FormField
                        control={control}
                        name="batchRange"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Batch Range</FormLabel>
                                <FormControl>
                                    {/* DO NOT manually set value. Let RHF control it via {...field}. */}
                                    <Input
                                        placeholder="Loading..."
                                        {...field} // RHF controls the value
                                        readOnly
                                        className="bg-muted"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Date Pickers for Manufacturing and Expiry */}
                    {(['manufacturingDate', 'expiryDate'] as const).map((dateField) => (
                        <FormField
                            key={dateField}
                            control={control}
                            name={dateField}
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{dateField === 'manufacturingDate' ? 'Manufacturing Date' : 'Expiry Date'}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline"
                                                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, 'PPP') :
                                                        <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                                      initialFocus/>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};