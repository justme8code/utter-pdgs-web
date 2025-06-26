// app/your-path/schema.ts (or in the same file as the modal)
import {z} from 'zod';

export const uomFormSchema = z.object({
    name: z.string().min(1, "UoM name is required").max(50, "Name must be 50 characters or less"),
    abbrev: z.string().min(1, "Abbreviation is required").max(10, "Abbreviation must be 10 characters or less"),
});

export type UomFormData = z.infer<typeof uomFormSchema>;


export const tasteBudSchema = z.object({
    evaluationType: z.enum(['IN_PROCESS', 'POST_PROCESS'], {
        required_error: 'You must select an evaluation type.',
    }),
    name: z.string().min(1, 'Name is required'),
    batchRange: z.string().min(1, 'Batch range is required'),
    manufacturingDate: z.date({
        required_error: 'A manufacturing date is required.',
    }),
    expiryDate: z.date({
        required_error: 'An expiry date is required.',
    }),
    productEvaluations: z.array(
        z.object({
            // --- ADD THIS LINE ---
            productMixId: z.number(), // The actual ID from your database
            title: z.string(),
            taste: z.enum(['ACCEPTABLE', 'UNACCEPTABLE']).optional(),
            afterTaste: z.enum(['ACCEPTABLE', 'UNACCEPTABLE']).optional(),
            viscosity: z.enum(['ACCEPTABLE', 'UNACCEPTABLE']).optional(),
            comments: z.string().optional(),
            release: z.string().optional(),
        }),
    ),
});

export type TasteBudFormData = z.infer<typeof tasteBudSchema>;
