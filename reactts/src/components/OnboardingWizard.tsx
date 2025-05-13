import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { supportedLngs } from '@/i18n';
import { useOnboardingStore } from '@/featureStores/useOnboardingStore';

const OnboardingWizard: React.FC = () => {
    const { isOpen, closeWizard } = useOnboardingStore();
    const { mode, setMode } = useThemeContext();
    const { language, setLanguage } = useLanguageContext();
    const [userName, setUserName] = useState<string>('');
    const [step, setStep] = useState<number>(1); // Track the current step

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSave = () => {
        console.log('User Info:', { userName, theme: mode, language });
        closeWizard();
    };

    return (
        <Dialog open={isOpen} onClose={closeWizard} fullWidth maxWidth="sm">
            <DialogTitle>Welcome to the App</DialogTitle>
            <DialogContent>
                {step === 1 && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Step 1: Enter your name.
                        </Typography>
                        <TextField
                            label="Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
                {step === 2 && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Step 2: Select your theme.
                        </Typography>
                        <Select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}
                            fullWidth
                        >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="system">System</MenuItem>
                        </Select>
                    </>
                )}
                {step === 3 && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Step 3: Choose your language.
                        </Typography>
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            fullWidth
                        >
                            {supportedLngs.map((lng) => (
                                <MenuItem key={lng} value={lng}>
                                    {lng.toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {step > 1 && (
                    <Button onClick={handleBack} color="secondary">
                        Back
                    </Button>
                )}
                {step < 3 && (
                    <Button onClick={handleNext} color="primary" variant="contained">
                        Next
                    </Button>
                )}
                {step === 3 && (
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default OnboardingWizard;