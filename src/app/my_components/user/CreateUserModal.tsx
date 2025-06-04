import { Modal } from "@/app/my_components/Modal";
import { TextField } from "@/app/my_components/TextField";
import { Button } from "@/app/my_components/Button";
import React, { useEffect, useState } from "react"; // Removed useActionState
import useAuthStore from "@/app/store/useAuthStore";
import { createUser, fetchRoles } from "@/app/actions/inventory"; // Assuming createUser is your server action
import { Role, User } from "@/app/types";

interface CreateUserModalProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ user, isOpen, onClose }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const { auth } = useAuthStore();
    const isEdit = !!user;

    // State for loading and error messages (replacing useActionState)
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleFetchRoles = async () => {
        try {
            const data = await fetchRoles();
            if (data && data.data) {
                setRoles(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
            // Optionally set an error state here if needed for UI
        }
    };

    useEffect(() => {
        if (isOpen) { // Fetch roles only when modal is open or user changes
            handleFetchRoles();
            if (user) {
                setSelectedRoles(user.roles ?? []);
            } else {
                // Reset for "Add User" mode
                setSelectedRoles([]);
                // You might want to reset other form fields' controlled state here if they were controlled
            }
            // Reset messages when modal opens or user changes
            setError(undefined);
            setSuccessMessage("");
        }
    }, [isOpen, user]); // Rerun effect if isOpen or user changes


    const toggleRoleSelection = (role: Role) => {
        setSelectedRoles((prevSelectedRoles) => {
            const isSelected = prevSelectedRoles.some((r) => r.id === role.id);
            return isSelected ? prevSelectedRoles.filter((r) => r.id !== role.id) : [...prevSelectedRoles, role];
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        setError(undefined);
        setSuccessMessage("");

        const formData = new FormData(event.currentTarget);

        // If editing, you might need to pass the user's ID.
        // Assuming `createUser` handles both create and update.
        // If your backend needs the ID in formData for updates:
        if (isEdit && user?.id) {
            formData.append('userId', user.id.toString());
        }

        try {
            // Call the server action.
            // The `createUser` action likely expects `previousState` as its first arg if designed for `useActionState`.
            // If it doesn't use `previousState` for its core logic, pass `undefined` or `null`.
            // The original useActionState was:
            // const status = await createUser(previousState, formData, selectedRoles);
            // This implies `createUser` returns a 'status' (e.g., boolean for success).
            // Errors were likely handled by `createUser` throwing, which `useActionState` would catch.
            const status = await createUser(undefined, formData, selectedRoles);

            if (status) { // Assuming `status` is truthy on success
                setSuccessMessage(isEdit ? "User updated successfully!" : "User created successfully!");
                setTimeout(() => {
                    onClose(); // Close modal first
                    if (typeof window !== "undefined") {
                        window.location.reload(); // Then reload if still necessary
                    }
                }, 1500);
            } else {
                // If status is falsy but no error was thrown by createUser
                setError(isEdit ? "Failed to update user. Please try again." : "Failed to create user. Please try again.");
                console.warn("createUser action returned a falsy status without throwing:", status);
            }
        } catch (e: unknown) { // Catch errors thrown by createUser
            let errorMessage = "An unexpected error occurred.";
            if (e instanceof Error) {
                errorMessage = e.message;
            } else if (typeof e === 'string') {
                errorMessage = e;
            } else if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
                errorMessage = e.message; // Handle errors that are objects with a message property
            }
            setError(errorMessage);
            console.error("Error during user creation/update:", e);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={"w-full max-w-md"}>
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit User" : "Add User"}</h2>
            {successMessage && <p className="text-green-500 font-semibold mb-3">{successMessage}</p>}
            {/* Use onSubmit for the form */}
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
                {error && ( // Ensure error is displayed above form fields or appropriately
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <TextField
                    name="fullName" // Ensure 'name' prop is used by TextField to set the input's name attribute
                    label="Full Name"
                    required
                    type="text"
                    placeholder="Enter Full Name"
                    defaultValue={user?.fullName ?? ""}
                    // If TextField supports 'key' for re-rendering on user change with defaultValue:
                    key={`fullName-${user?.id ?? 'new'}`}
                />
                <TextField
                    name="email"
                    label="Email"
                    required
                    type="email"
                    placeholder="Enter Email"
                    defaultValue={user?.email ?? ""}
                    key={`email-${user?.id ?? 'new'}`}
                />
                <TextField
                    name="companyRole"
                    label="Company Role"
                    required
                    type="text"
                    placeholder="Enter Company Role"
                    defaultValue={user?.staff?.companyRole ?? ""}
                    key={`companyRole-${user?.id ?? 'new'}`}
                />
                <TextField
                    name="password"
                    label="Password"
                    required={!isEdit} // Password might not be required for edit unless changing
                    type="password"
                    placeholder={isEdit ? "Leave blank to keep current password" : "Enter Password"}
                    defaultValue="" // Always start blank for security
                    key={`password-${user?.id ?? 'new'}`} // Ensure it resets
                />
                {auth && auth?.user?.roles?.length > 0 && roles.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-2">Select Roles:</h3>
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    onChange={() => toggleRoleSelection(role)}
                                    checked={selectedRoles.some((r) => r.id === role.id)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    // name="roles[]" // Not strictly needed if selectedRoles is passed separately
                                />
                                {role.userRole}
                            </label>
                        ))}
                    </div>
                )}
                <Button
                    label={isPending ? "Processing..." : isEdit ? "Update User" : "Add User"}
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full" // Added w-full for better styling
                    disabled={isPending}
                />
            </form>
        </Modal>
    );
};