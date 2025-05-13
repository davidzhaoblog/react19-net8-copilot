import { create } from 'zustand';

interface OnboardingState {
    isOpen: boolean;
    openWizard: () => void;
    closeWizard: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    isOpen: false,
    openWizard: () => set({ isOpen: true }),
    closeWizard: () => set({ isOpen: false }),
}));