import React from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import OnboardingWizard from '@/components/OnboardingWizard';
import { useOnboardingStore } from '@/featureStores/useOnboardingStore';

const Home: React.FC = () => {
    const { openWizard } = useOnboardingStore();
    return (
        <div className="p-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
                onClick={openWizard}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Open Onboarding Wizard
            </button>
            <OnboardingWizard />
            <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        </div>
    );
};

export default Home;
