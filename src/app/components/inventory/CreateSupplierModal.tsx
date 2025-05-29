import { Modal } from "@/app/components/Modal";
import { TextField2 } from "@/app/components/TextField2";
import { Button } from "@/app/components/Button";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {createSuppliers, updateSupplier} from "@/app/actions/inventory";
import {SupplierFormData, supplierSchema} from "@/app/suppliers/supplierform";
import {Supplier} from "@/app/types";

interface CreateSupplierModalProps {
    supplier?: Supplier;
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
}

export const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({isEdit, supplier, isOpen, onClose }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            fullName: "",
            address: "",
            phoneNumber: "",
            emailAddress: "",
        },
    });

    useEffect(() => {
        if (supplier && isEdit) {
            reset({
                fullName: supplier.fullName ?? "",
                address: supplier.address ?? "",
                phoneNumber: supplier.phoneNumber ?? "",
                emailAddress: supplier.emailAddress ?? "",
            });
        }
    }, [supplier, reset, isEdit]);

    const onSubmit = async (data: SupplierFormData) => {
        if (!isEdit) {
            const { status } = await createSuppliers({
                id: null,
                ...data
            });
            if (status) {
                alert("Supplier created!");
                setTimeout(() => window.location.reload(), 1500);
                onClose();
            }
        } else {
           if(supplier && supplier.id && supplier.id > 0){
                const { status } = await updateSupplier(supplier.id,{
                    id:supplier.id,
                    ...data
                });
                if (status) {
                    alert("Supplier updated!");
                    setTimeout(() => window.location.reload(), 1500);
                    onClose();
                }
            }
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Supplier" : "Add Supplier"}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
                <div>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <TextField2
                                label="Full Name"
                                placeholder="Enter Full Name"
                                field={field}
                            />
                        )}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>

                <div>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField2
                                label="Address"
                                placeholder="Enter Address"
                                field={field}
                            />
                        )}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                <div>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField2
                                label="Phone Number"
                                placeholder="Enter Phone Number"
                                field={field}
                            />
                        )}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                    <Controller
                        name="emailAddress"
                        control={control}
                        render={({ field }) => (
                            <TextField2
                                label="Email Address"
                                placeholder="Enter Email"
                                field={field}
                            />
                        )}
                    />
                    {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress.message}</p>}
                </div>

                <Button
                    type="submit"
                    label={isSubmitting ? "Processing..." : isEdit ? "Update Supplier" : "Add Supplier"}
                    disabled={isSubmitting}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                />
            </form>
        </Modal>
    );
};
