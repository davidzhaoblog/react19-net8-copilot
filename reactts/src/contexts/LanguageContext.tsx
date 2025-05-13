import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/i18n'; // Import your i18n instance

interface LanguageContextProps {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || i18n.language || 'en';
    });

    useEffect(() => {
        i18n.changeLanguage(language); // Change the language in i18n
        localStorage.setItem('language', language); // Persist the language in localStorage
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguageContext = (): LanguageContextProps => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguageContext must be used within a LanguageProvider');
    }
    return context;
};