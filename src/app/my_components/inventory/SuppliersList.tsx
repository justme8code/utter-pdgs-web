// app/your-path/SuppliersList.tsx
'use client';
import React, {useEffect, useState} from "react"; // useCallback might be useful for other handlers
import {CreateSupplierModal} from "./CreateSupplierModal";
import useSupplierStore from "@/app/store/SupplierStore";
import {Supplier} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {AlertTriangle, Edit, Loader2, PlusCircle, Search, Trash2, Truck, UserSearch} from "lucide-react";

export const SuppliersList = () => {
    // Select individual pieces of state. References to functions like fetchSuppliers are stable from Zustand.
    const suppliers = useSupplierStore((state) => state.suppliers);
    const fetchSuppliers = useSupplierStore((state) => state.fetchSuppliers); // Stable reference
    const suppliersLoading = useSupplierStore((state) => state.loading);
    const suppliersError = useSupplierStore((state) => state.error);
    // Potentially add createSupplier, deleteSupplier etc. if needed for the list view directly
    // const createSupplier = useSupplierStore((state) => state.createSupplier);

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSuppliers(); // Call the stable function reference from the store
    }, [fetchSuppliers]); // This dependency is stable, so useEffect runs once on mount

    const handleOpenCreateModal = () => {
        setSelectedSupplier(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSupplier(null);
        setIsEditMode(false);
        // If your create/edit actions in the modal update the Zustand store directly,
        // the `suppliers` array will automatically re-render this component.
        // So, calling fetchSuppliers() here might be redundant unless there's a specific reason.
        // fetchSuppliers();
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.emailAddress && supplier.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.phoneNumber && supplier.phoneNumber.includes(searchTerm))
    );

    const handleDeleteSupplier = async (supplierId: number | undefined) => {
        if (!supplierId) return;
        // Assuming you add deleteSupplier to your store
        // const { deleteSupplier } = useSupplierStore.getState(); // Get action directly if not selected above
        // const result = await deleteSupplier(supplierId);
        // if (!result.success) {
        //     alert(result.error || "Failed to delete supplier");
        // }
        // The list will auto-update if deleteSupplier modifies the store's suppliers array.
        alert(`TODO: Implement delete for supplier ID: ${supplierId} using store action`);
    };


    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Truck className="h-6 w-6 text-primary"/>
                                Suppliers Management
                            </CardTitle>
                            <CardDescription>View, add, and manage your suppliers.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    type="search"
                                    placeholder="Search suppliers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-full"
                                />
                            </div>
                            <Button onClick={handleOpenCreateModal}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add Supplier
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isModalOpen && (
                        <CreateSupplierModal
                            supplier={selectedSupplier ?? undefined}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            isEdit={isEditMode}
                        />
                    )}
                    {suppliersLoading && !isModalOpen ? ( // Only show page loader if modal isn't causing its own loading state
                        <div className="flex items-center justify-center h-60">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                            <span className="ml-2 text-muted-foreground">Loading suppliers...</span>
                        </div>
                    ) : suppliersError ? (
                        <div className="text-center py-10 text-destructive">
                            <AlertTriangle className="mx-auto h-10 w-10 mb-2"/>
                            Error loading suppliers: {suppliersError}
                        </div>
                    ) : (
                        <Table>
                            {(filteredSuppliers.length === 0 && !suppliersLoading) && ( // Ensure not loading when showing empty
                                <TableCaption className="py-10">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <UserSearch className="h-12 w-12 text-muted-foreground/70"/>
                                        <p className="text-lg font-medium text-muted-foreground">
                                            {searchTerm ? "No suppliers match your search." : "No suppliers found."}
                                        </p>
                                        {!searchTerm &&
                                            <p className="text-sm text-muted-foreground">{"Click \"Add Supplier\" to get started."}</p>}
                                    </div>
                                </TableCaption>
                            )}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Full Name</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Email Address</TableHead>
                                    <TableHead className="w-[250px]">Address</TableHead>
                                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.fullName}</TableCell>
                                        <TableCell>{supplier.phoneNumber || "N/A"}</TableCell>
                                        <TableCell>{supplier.emailAddress || "N/A"}</TableCell>
                                        <TableCell className="truncate max-w-xs">{supplier.address || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Button variant="ghost" size="icon"
                                                        onClick={() => handleOpenEditModal(supplier)}
                                                        title="Edit Supplier">
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button variant="ghost" size="icon"
                                                        onClick={() => supplier.id ? handleDeleteSupplier(supplier.id) : undefined}
                                                        title="Delete Supplier"
                                                        className="text-destructive hover:text-destructive/80">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};