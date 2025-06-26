// stores/useLoadingUI.ts
import {create} from 'zustand';
import {toast} from 'react-hot-toast'; // Or 'sonner' if you switched

interface LoadingUIState { // Changed type name for clarity if needed
    loading: boolean;
    successMessage: string | null;
    status: boolean | null; // This status relates to the successMessage
    errorMessage: string | null; // New state for dedicated error messages
}

interface LoadingUIActions { // Changed type name for clarity if needed
    setLoading: (value: boolean) => void;
    setSuccessMessage: (msg: string | null, status?: boolean) => void;
    setErrorMessage: (msg: string | null) => void; // New action for setting errors
    resetUI: () => void;
}

// Combine state and actions for the store type
type LoadingUIStore = LoadingUIState & LoadingUIActions;


export const useLoadingUI = create<LoadingUIStore>((set) => ({
    // Initial State
    loading: false,
    successMessage: null,
    status: null,
    errorMessage: null, // Initialize new error state

    // Actions
    setLoading: (value) => set({loading: value}),

    setSuccessMessage: (msg, status = true) => {
        if (msg) {
            if (status) {
                toast.success(msg);
            } else {

                toast.error(msg); // If status is false, it's an error related to the "success" flow
            }
            set({
                successMessage: msg,
                status: status,
                errorMessage: null // Clear dedicated error if setting a success/response message
            });

            setTimeout(() => {
                set({successMessage: null, status: null});
            }, 3000);
        } else {
            // If msg is null, clear success message and status
            set({successMessage: null, status: null});
        }
    },

    setErrorMessage: (msg: string | null) => {
        if (msg) {
            toast.error(msg); // Always show an error toast
            set({
                errorMessage: msg,
                successMessage: null, // Clear success message when an error is set
                status: false         // Indicate an error state overall
            });

            // Optional: Auto-clear the error message after a delay
            // setTimeout(() => {
            //     set({ errorMessage: null });
            // }, 5000); // Errors might persist longer
        } else {
            // If msg is null, just clear the error message
            set({errorMessage: null});
        }
    },

    resetUI: () => set({
        loading: false,
        successMessage: null,
        status: null,
        errorMessage: null, // Reset new error state
    }),
}));