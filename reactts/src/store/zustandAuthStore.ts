import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageKeys } from '@/types/StorageKeys';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    usedToken: string | null;
    whenAuthTokenChange: (accessToken: string, refreshToken: string) => void;
    whenLogoutUser: () => void;
    whenAdjustUsedToken: (usedToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: localStorage.getItem(StorageKeys.Token),
            refreshToken: localStorage.getItem(StorageKeys.RefreshToken),
            usedToken: localStorage.getItem(StorageKeys.Token),
            whenAuthTokenChange: (accessToken, refreshToken) => {
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                set({ token: accessToken, refreshToken, usedToken: accessToken });
            },
            whenLogoutUser: () => {
                localStorage.removeItem(StorageKeys.Token);
                localStorage.removeItem(StorageKeys.RefreshToken);
                set({ token: null, refreshToken: null, usedToken: null });
            },
            whenAdjustUsedToken: (usedToken) => {
                set({ usedToken });
            },
        }),
        { name: 'auth-storage' } // localStorage key
    )
);