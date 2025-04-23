import React, { useEffect, useState } from "react";
import useSupplierStore, {NewSupplier} from "@/app/store/SupplierStore";
import { CreateSupplierModal } from "./CreateSupplierModal";

export const SuppliersList = () => {
    const { suppliers, fetchSuppliers } = useSupplierStore();
    const [selectedSupplier, setSelectedSupplier] = useState<NewSupplier|null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return (
        <div className={"w-full shadow-xs p-5 hover:shadow-xl"}>
            <div className={"flex items-center w-full gap-10 mb-5"}>
                <h2 className="text-xl font-bold">Suppliers</h2>
                <button
                    onClick={() => {
                        setSelectedSupplier(null);
                        setIsOpen(true);
                    }}
                    className={"bg-gray-200 text-sm ring-1 ring-gray-300 flex items-center gap-2 p-1 rounded-sm"}
                >
                    <p>Create New Supplier</p>
                </button>
            </div>
            {isOpen && (
                <CreateSupplierModal
                    supplier={selectedSupplier??undefined}
                    isOpen={isOpen}
                    onClose={() => {
                        setSelectedSupplier(null);
                        setIsOpen(false);
                    }}
                />
            )}
            <div className="">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Full Name</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="border border-gray-50">
                                <td className="border border-gray-300 p-2">{supplier.fullName}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full mr-2"
                                        onClick={() => {
                                             if(supplier) {
                                                 setSelectedSupplier(supplier);
                                                 setIsOpen(true);
                                             }
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};