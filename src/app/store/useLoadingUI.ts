// stores/useLoadingUI.ts
import { create } from 'zustand';
import { toast } from 'react-hot-toast';

type LoadingUIStore = {
    loading: boolean;
    setLoading: (value: boolean) => void;

    successMessage: string | null;
    status: boolean | null;

    setSuccessMessage: (msg: string | null, status?: boolean) => void;
    resetUI: () => void;
};

export const useLoadingUI = create<LoadingUIStore>((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),

    successMessage: null,
    status: null,

    setSuccessMessage: (msg, status = true) => {
        if (msg) {
            if (status) {
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            set({ successMessage: msg, status:status });

            setTimeout(() => {
                set({ successMessage: null, status: null });
            }, 3000);
        }
    },

    resetUI: () => set({ loading: false, successMessage: null, status: null }),
}));
