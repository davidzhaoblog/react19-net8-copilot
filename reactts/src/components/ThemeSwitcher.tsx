import React from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
    const { mode, setMode } = useThemeContext();

    const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
    };

    return (
        <>
            <div className="flex space-x-4 text-gray-700 dark:text-gray-300">tailWind css theme example: This text changes color based on the theme.</div>
            <div className="flex space-x-4">
                <button
                    className={`px-4 py-2 rounded ${mode === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleThemeChange('light')}
                >
                    Light
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleThemeChange('dark')}
                >
                    Dark
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleThemeChange('system')}
                >
                    System
                </button>
            </div>
        </>
    );
};

export default ThemeSwitcher;