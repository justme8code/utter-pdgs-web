import { create } from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type UserRole = {
    id: number;
    userRole: string;
};

export type User = {
    id: number;
    fullName: string;
    staffId: number;
    staffProfession: string;
    staffCompanyRole: string;
    roles: UserRole[];
};

export type AuthResponse = {
    user: User;
    jwtToken: string;
};

export type AuthState = {
    auth: AuthResponse | null;
    setAuth: (auth: AuthResponse) => void;
    clearAuth: () => void;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            auth: null,
            setAuth: (auth) => set({ auth }),
            clearAuth: () => set({ auth: null }),
        }),
        {
            name: 'auth-storage', // Storage key,
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useAuthStore;
