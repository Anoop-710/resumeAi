'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(true);

    // Initialize dark mode from localStorage or default to dark mode
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(JSON.parse(savedMode));
        }
        // If no saved preference, keep the default dark mode (true)
        // Only override if user explicitly wants system preference
    }, []);

    // Save dark mode preference and apply to document
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
