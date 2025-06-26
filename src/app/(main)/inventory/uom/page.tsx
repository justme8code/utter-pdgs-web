// app/your-path/UomPage.tsx
'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {useUomStore} from '@/app/store/uomStore'; // Adjust path
import {Unitofmeasurement} from '@/app/types';
import {UomModal} from './UomModal'; // Adjust path
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {AlertTriangleIcon, Edit, Info, Loader2, PlusCircle, Scale, Search, Trash2} from 'lucide-react';
import {toast} from 'sonner';

export default function UomPage() {
    // Destructure isLoading and error directly from the store
    const {
        uoms,
        fetchUoms,
        // createUom, // Not directly called from UomPage, but from UomModal
        // updateUom, // Not directly called from UomPage, but from UomModal
        deleteUom,
        isLoading: uomStoreIsLoading, // Use the store's loading state
        error: uomStoreError,         // Use the store's error state
        clearError: clearUomStoreError // Assuming your store has this
    } = useUomStore();

    const [selectedUom, setSelectedUom] = useState<Unitofmeasurement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isEditMode, setIsEditMode] = useState(false); // isEditMode is implicitly handled by selectedUom in modal
    const [searchTerm, setSearchTerm] = useState("");
    const [uomToDelete, setUomToDelete] = useState<Unitofmeasurement | null>(null);

    const loadUoms = useCallback(() => {
        if (clearUomStoreError) { // Check if clearUomStoreError exists before calling
            clearUomStoreError();
        }
        fetchUoms();
    }, [fetchUoms, clearUomStoreError]);

    useEffect(() => {
        loadUoms();
    }, [loadUoms]); // This will run once on mount due to stable fetchUoms reference

    const handleOpenCreateModal = () => {
        setSelectedUom(null); // Signals create mode to modal
        // setIsEditMode(false); // Not strictly needed if modal checks for uom prop
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (uom: Unitofmeasurement) => {
        setSelectedUom(uom); // Signals edit mode to modal
        // setIsEditMode(true); // Not strictly needed
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUom(null);
        // setIsEditMode(false); // Not strictly needed
        // The UomModal will call fetchUoms on successful save, so no need here usually
    };

    const handleDeleteConfirmation = (uom: Unitofmeasurement) => {
        setUomToDelete(uom);
    };

    const executeDelete = async () => {
        if (uomToDelete && uomToDelete.id) {
            // The deleteUom action in the store should handle its own loading/error states for this specific action
            // The global uomStoreIsLoading might briefly become true if deleteUom sets it.
            const result = await deleteUom(uomToDelete.id);
            if (result.status) {
                toast.success("UoM deleted successfully!");
            } else {
                toast.error(result.error || "Failed to delete UoM.");
            }
        }
        setUomToDelete(null);
    };

    const filteredUoms = uoms.filter(uom =>
        uom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uom.abbrev.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Scale className="h-6 w-6 text-primary"/>
                                Units of Measurement (UoM)
                            </CardTitle>
                            <CardDescription>Manage units of measurement used for inventory and
                                products.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    type="search"
                                    placeholder="Search UoMs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-full"
                                />
                            </div>
                            <Button onClick={handleOpenCreateModal} disabled={uomStoreIsLoading}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add UoM
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isModalOpen && (
                        <UomModal
                            uom={selectedUom ?? undefined} // Pass selectedUom for edit, undefined for create
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            // isEdit prop in UomModal can be derived from whether `uom` prop is passed
                        />
                    )}

                    {/* Use uomStoreIsLoading and uomStoreError from the store */}
                    {uomStoreIsLoading && !isModalOpen ? (
                        <div className="flex items-center justify-center h-60">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                            <span className="ml-2 text-muted-foreground">Loading UoMs...</span>
                        </div>
                    ) : uomStoreError && !isModalOpen ? (
                        <div className="text-center py-10 text-destructive">
                            <AlertTriangleIcon className="mx-auto h-10 w-10 mb-2"/>
                            Error: {uomStoreError}.
                            <Button variant="link" onClick={loadUoms} className="block mx-auto mt-2">Try
                                refreshing</Button>
                        </div>
                    ) : (
                        <Table>
                            {(filteredUoms.length === 0 && !uomStoreIsLoading) && (
                                <TableCaption className="py-10">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Info className="h-12 w-12 text-muted-foreground/70"/>
                                        <p className="text-lg font-medium text-muted-foreground">
                                            {searchTerm ? "No UoMs match your search." : "No Units of Measurement found."}
                                        </p>
                                        {!searchTerm &&
                                            <p className="text-sm text-muted-foreground">{"Click Add UoM to create one."}</p>}
                                    </div>
                                </TableCaption>
                            )}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[150px]">Abbreviation</TableHead>
                                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUoms.map((uom) => (
                                    <TableRow key={uom.id}>
                                        <TableCell className="font-medium">{uom.id}</TableCell>
                                        <TableCell>{uom.name}</TableCell>
                                        <TableCell>{uom.abbrev}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Button variant="ghost" size="icon"
                                                        onClick={() => handleOpenEditModal(uom)} title="Edit UoM"
                                                        disabled={uomStoreIsLoading}>
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                {/* THIS IS NOW CORRECT - NO AlertDialogTrigger WRAPPER */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteConfirmation(uom)} // Directly sets state to open the AlertDialog
                                                    title="Delete UoM"
                                                    className="text-destructive hover:text-destructive/80"
                                                    disabled={uomStoreIsLoading}
                                                >
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

            <AlertDialog open={!!uomToDelete} onOpenChange={(open) => !open && setUomToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`This action cannot be undone. This will permanently delete the unit of measurement \"${uomToDelete?.name}\" (${uomToDelete?.abbrev})`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUomToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}