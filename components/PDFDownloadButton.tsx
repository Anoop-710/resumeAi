// components/PDFDownloadButton.tsx
'use client'; // This component must be a client component

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF'; // Import the document component

export const PDFDownloadButton = ({ resultText }: { resultText: string }) => {
    // Don't render the button if there is no text to download
    if (!resultText) {
        return null;
    }

    return (
        <PDFDownloadLink
            document={<ResumePDF resultText={resultText} />}
            fileName="resume.pdf"
            // Style the link to look like a button
            style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold',
            }}
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Download as PDF'
            }
        </PDFDownloadLink>
    );
};