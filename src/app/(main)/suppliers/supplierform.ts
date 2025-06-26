import {z} from "zod";

export const supplierSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
    emailAddress: z.string().email("Invalid email"),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
