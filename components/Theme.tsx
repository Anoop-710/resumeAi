// File: app/theme-test/ThemeGreen.tsx
'use client';

const ThemeGreen = {
    light: {
        background: "#f9fafb",   // gray-50
        text: "#111827",        // gray-900
        secondary: "#4338ca",   // indigo-700
        accent: "#10b981",      // emerald-500
        hover: "#059669",       // emerald-600
        gradient: "linear-gradient(to right, #4338ca, #10b981)",
    }

    ,
    dark: {
        background: "#022c22",  // emerald-950
        text: "#818cf8",        // emerald-50
        secondary: "#6ee7b7",   // emerald-300
        accent: "#34d399",      // emerald-400
        hover: "#10b981",       // emerald-500
        gradient: "linear-gradient(to right, #064e3b, #10b981)",
    },
};

export default ThemeGreen;
