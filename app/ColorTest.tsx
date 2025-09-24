'use client';

import React from "react";

type Theme = {
    background: string;
    text: string;
    secondary: string;
    accent: string;
    hover: string;
    gradient: string;
};

export default function ColorTest({ theme }: { theme: Theme }) {
    return (
        <div
            className="min-h-screen p-8 space-y-6"
            style={{ background: theme.background, color: theme.text }}
        >
            <h1 className="text-3xl font-bold">Theme Preview</h1>
            <p style={{ color: theme.secondary }}>
                This is secondary text (muted/subtle info).
            </p>

            {/* Accent button */}
            <button
                className="px-4 py-2 rounded font-semibold"
                style={{
                    background: theme.accent,
                    color: "#fff",
                }}
            >
                Accent Button
            </button>

            {/* Hover button */}
            <button
                className="px-4 py-2 rounded font-semibold"
                style={{
                    background: theme.hover,
                    color: "#fff",
                }}
            >
                Hover Button
            </button>

            {/* Gradient example */}
            <div
                className="p-6 rounded-lg text-white font-bold"
                style={{ background: theme.gradient }}
            >
                Gradient Section
            </div>

            {/* Text block */}
            <div className="p-4 rounded-lg" style={{ border: `2px solid ${theme.secondary}` }}>
                <h2 className="text-xl font-semibold">Text + Border</h2>
                <p>
                    Primary text uses <code>theme.text</code>, secondary text uses{" "}
                    <span style={{ color: theme.secondary }}>theme.secondary</span>.
                </p>
            </div>
        </div>
    );
}
