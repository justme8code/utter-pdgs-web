import { Modal } from "@/app/components/Modal";
import { TextField } from "@/app/components/TextField";
import { Button } from "@/app/components/Button";
import React, { useActionState, useState } from "react";
import { createSuppliers } from "@/app/actions/inventory";
import { NewSupplier } from "@/app/store/SupplierStore";

interface CreateSupplierModalProps {
    supplier?: NewSupplier;
    isOpen: boolean;
    onClose: () => void;
}

export const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({ supplier, isOpen, onClose }) => {
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const isEdit = !!supplier;

    const validateForm = (formData: FormData) => {
        const newErrors: { [key: string]: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{7,15}$/;

        if (!formData.get("fullName")) newErrors.fullName = "Full Name is required.";
        if (!formData.get("address")) newErrors.address = "Address is required.";
        if (!phoneRegex.test(formData.get("phoneNumber") as string)) {
            newErrors.phoneNumber = "Phone Number is required.";
        }
        if (!formData.get("emailAddress")) {
            newErrors.emailAddress = "Email Address is required.";
        } else if (!emailRegex.test(formData.get("emailAddress") as string)) {
            newErrors.emailAddress = "Invalid email format.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, action, isPending] = useActionState(async (previousState: unknown, formData: FormData) => {
        if (!validateForm(formData)) return;

        const newSupplier: NewSupplier = {
            fullName: formData.get("fullName") as string,
            address: formData.get("address") as string,
            phoneNumber: formData.get("phoneNumber") as string,
            emailAddress: formData.get("emailAddress") as string,
        };

        const { status } = await createSuppliers(newSupplier);
        if (status) {
            setSuccessMessage(isEdit ? "Supplier updated successfully!" : "Supplier created successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }, null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={"w-full max-w-md"}>
            <h2 className="text-xl font-bold mb-4">{supplier ? "Edit Supplier" : "Add Supplier"}</h2>
            {successMessage && <p className="text-green-500 font-semibold">{successMessage}</p>}

            <form action={action} className="space-y-5 w-full">
                <div>
                    <TextField
                        name="fullName"
                        label="Full Name"
                        required
                        type="text"
                        placeholder="Enter Full Name"
                        defaultValue={supplier?.fullName ?? ""}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                <div>
                    <TextField
                        name="address"
                        label="Address"
                        required
                        type="text"
                        placeholder="Enter Address"
                        defaultValue={supplier?.address ?? ""}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
                <div>
                    <TextField
                        name="phoneNumber"
                        label="Phone Number"
                        required
                        type="text"
                        placeholder="Enter Phone Number"
                        defaultValue={supplier?.phoneNumber ?? ""}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
                <div>
                    <TextField
                        name="emailAddress"
                        label="Email Address"
                        required
                        type="email"
                        placeholder="Enter Email Address"
                        defaultValue={supplier?.emailAddress ?? ""}
                    />
                    {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
                </div>
                <Button
                    label={isPending ? "Processing..." : supplier ? "Update Supplier" : "Add Supplier"}
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={isPending}
                />
            </form>
        </Modal>
    );
};
