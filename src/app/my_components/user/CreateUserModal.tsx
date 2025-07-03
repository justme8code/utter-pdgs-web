// app/your-path/CreateUserModal.tsx
'use client';

import React, {useCallback, useEffect, useRef, useState} from "react";
import useAuthStore from "@/app/store/useAuthStore";
import {createUser, fetchRoles} from "@/api/inventory"; // Assuming correct path
import {Role, User} from "@/app/types";


import {Button as ShadcnButton} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input as ShadcnInput} from "@/components/ui/input";
import {Label as ShadcnLabel} from "@/components/ui/label";
import {Checkbox as ShadcnCheckbox} from "@/components/ui/checkbox"; // Shadcn Checkbox
import {ScrollArea} from "@/components/ui/scroll-area"; // For roles list
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle, CheckCircle2, Loader2, ShieldCheck, UserCog, UserPlus} from "lucide-react";

interface CreateUserModalProps {
    user?: User; // If present, it's edit mode
    isOpen: boolean;
    onClose: () => void;
    // isEdit prop is redundant if `user` prop presence determines edit mode
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({user, isOpen, onClose}) => {
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [formSuccess, setFormSuccess] = useState<string>("");
    const [isPending, setIsPending] = useState(false);
    const {auth} = useAuthStore();
    const isEditMode = !!user;

    // Use a ref for the form to manually reset if needed, though not strictly necessary here
    const formRef = useRef<HTMLFormElement>(null);

    const initializeFormState = useCallback(() => {
        if (isEditMode && user) {
            setSelectedRoles(user.roles ?? []);
        } else {
            setSelectedRoles([]);
        }
        setFormError(undefined);
        setFormSuccess("");
    }, [isEditMode, user]); // Memoize the function based on these dependencies


    useEffect(() => {
        if (isOpen) {
            const loadRoles = async () => {
                try {
                    const data = await fetchRoles();
                    if (data && data.data) {
                        setAllRoles(data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch roles:", err);
                    setFormError("Could not load user roles. Please try again.");
                }
            };
            loadRoles();
            initializeFormState(); // Initialize/reset form state when modal opens or user changes
        }
    }, [isOpen, user, isEditMode, initializeFormState]); // Rerun effect if isOpen or user changes (which implies isEditMode might change)


    const toggleRoleSelection = (role: Role) => {
        setSelectedRoles((prevSelectedRoles) => {
            const isSelected = prevSelectedRoles.some((r) => r.id === role.id);
            return isSelected
                ? prevSelectedRoles.filter((r) => r.id !== role.id)
                : [...prevSelectedRoles, role];
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        setFormError(undefined);
        setFormSuccess("");

        const formData = new FormData(event.currentTarget);

        if (isEditMode && user?.id) {
            formData.append('userId', user.id.toString()); // Add userId for update
        }
        // Password validation for create mode
        const password = formData.get('password') as string;
        if (!isEditMode && (!password || password.length < 6)) { // Example: min 6 chars for new users
            setFormError("Password is required and must be at least 6 characters for new users.");
            setIsPending(false);
            return;
        }


        try {
            // `createUser` action now directly called.
            // It must be adapted to not expect `previousState` if it was designed for `useActionState`.
            // It should handle FormData and selectedRoles, and return a clear success/error indication.
            // Let's assume `createUser` now returns something like:
            // { success: boolean, message?: string, data?: User }
            const response = await createUser(isEditMode, formData, selectedRoles); // Pass isEditMode if action handles both

            if (response.status) {
                setFormSuccess(response.error || (isEditMode ? "User updated successfully!" : "User created successfully!"));
                // toast.success(response.message || (isEditMode ? "User updated successfully!" : "User created successfully!"));
                setTimeout(() => {
                    onClose();
                    // Consider if page reload is truly necessary.
                    // If the parent list re-fetches on its own or via store update, reload is often not needed.
                    // if (typeof window !== "undefined") {
                    //     window.location.reload();
                    // }
                }, 1500);
            } else {
                setFormError(response.error || (isEditMode ? "Failed to update user." : "Failed to create user."));
                // toast.error(response.message || (isEditMode ? "Failed to update user." : "Failed to create user."));
            }
        } catch (e: unknown) {
            let errorMessage = "An unexpected error occurred.";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            // ... (more robust error message extraction as before)
            setFormError(errorMessage);
            // toast.error(errorMessage);
            console.error("Error during user creation/update:", e);
        } finally {
            setIsPending(false);
        }
    };


    const handleModalOpenChange = (open: boolean) => {
        if (!isPending) { // Prevent closing if loading
            if (!open) { // Only call onClose when attempting to close
                onClose();
            }
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
            <DialogContent className="sm:max-w-lg"> {/* Adjust width as needed */}
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        {isEditMode ? <UserCog className="h-5 w-5"/> : <UserPlus className="h-5 w-5"/>}
                        {isEditMode ? "Edit User" : "Add New User"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the details for this user." : "Enter the details for the new user."}
                    </DialogDescription>
                </DialogHeader>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-2">
                    {formError && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}
                    {formSuccess && (
                        <Alert variant="default"
                               className="bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4"/>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{formSuccess}</AlertDescription>
                        </Alert>
                    )}

                    {/* Full Name */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="fullName-modal">Full Name</ShadcnLabel>
                        <ShadcnInput
                            id="fullName-modal"
                            name="fullName"
                            type="text"
                            placeholder="e.g., Jane Doe"
                            defaultValue={user?.fullName ?? ""}
                            key={`fullName-${user?.id ?? 'new'}`} // Add key to ensure defaultValue updates
                            required
                            disabled={isPending}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="email-modal">Email</ShadcnLabel>
                        <ShadcnInput
                            id="email-modal"
                            name="email"
                            type="email"
                            placeholder="e.g., jane.doe@example.com"
                            defaultValue={user?.email ?? ""}
                            key={`email-${user?.id ?? 'new'}`}
                            required
                            disabled={isPending}
                        />
                    </div>
                    {/* Company Role / Staff Profession */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="companyRole-modal">Company Role / Profession</ShadcnLabel>
                        <ShadcnInput
                            id="companyRole-modal"
                            name="companyRole" // This will be part of FormData
                            type="text"
                            placeholder="e.g., Production Manager"
                            defaultValue={user?.staff?.companyRole ?? ""}
                            key={`companyRole-${user?.id ?? 'new'}`}
                            required
                            disabled={isPending}
                        />
                    </div>


                    {/* Password */}
                    <div className="space-y-1">
                        <ShadcnLabel htmlFor="password-modal">Password</ShadcnLabel>
                        <ShadcnInput
                            id="password-modal"
                            name="password"
                            type="password"
                            placeholder={isEditMode ? "Leave blank to keep current" : "Enter password"}
                            defaultValue="" // Always blank for password fields
                            key={`password-${user?.id ?? 'new'}`} // Force re-render
                            required={!isEditMode} // Only required for new users
                            disabled={isPending}
                        />
                        {!isEditMode && <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>}
                    </div>


                    {/* Roles Selection */}
                    {auth && auth.user?.roles?.length > 0 && allRoles.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <ShadcnLabel className="flex items-center gap-1.5 font-semibold">
                                <ShieldCheck className="h-4 w-4 text-muted-foreground"/> Select User Roles:
                            </ShadcnLabel>
                            <ScrollArea className="h-32 rounded-md border p-3">
                                <div className="space-y-2">
                                    {allRoles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <ShadcnCheckbox
                                                id={`role-${role.id}-modal`}
                                                checked={selectedRoles.some((r) => r.id === role.id)}
                                                onCheckedChange={() => toggleRoleSelection(role)}
                                                disabled={isPending}
                                            />
                                            <label
                                                htmlFor={`role-${role.id}-modal`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {role.userRole.replace("ROLE_", "")}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <ShadcnButton type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </ShadcnButton>
                        </DialogClose>
                        <ShadcnButton type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isPending ? "Processing..." : isEditMode ? "Update User" : "Add User"}
                        </ShadcnButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};