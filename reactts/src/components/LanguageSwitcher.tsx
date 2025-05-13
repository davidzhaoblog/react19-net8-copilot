import React from 'react';
import { Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { supportedLngs } from '@/i18n';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguageContext();

    const handleChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };

    return (
        <div>
            <Typography variant="body1" gutterBottom>
                Select Language:
            </Typography>
            <Select value={language} onChange={handleChange} fullWidth>
                {supportedLngs.map((lng) => (
                    <MenuItem key={lng} value={lng}>
                        {lng.toUpperCase()}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default LanguageSwitcher;