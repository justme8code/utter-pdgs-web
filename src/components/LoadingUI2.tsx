// stores/useLoadingUI.ts
import {create} from 'zustand';
import {toast} from "sonner";

interface LoadingUIState {
    loading: boolean;
}

interface LoadingUIActions {
    setLoading: (value: boolean) => void;
    // We remove the message state from the store itself, as it's transient.
    // The store now only provides helper functions to show toasts.
    showSuccessToast: (msg: string) => void;
    showErrorToast: (msg: string) => void;
    resetUI: () => void;
}

type LoadingUIStore = LoadingUIState & LoadingUIActions;

export const useLoadingUI2 = create<LoadingUIStore>((set) => ({
    // Initial State is much simpler
    loading: false,

    // Actions
    setLoading: (value) => set({loading: value}),

    // These actions are now just side-effects. They don't set any state.
    showSuccessToast: (msg) => {
        toast.success(msg);
    },

    showErrorToast: (msg) => {
        toast.error(msg);
    },

    resetUI: () => set({
        loading: false,
    }),
}));