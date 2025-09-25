'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';

interface PDFDownloadButtonProps {
    resultText: string; // string returned from AI API (JSON string)
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ resultText }) => {
    if (!resultText) return null;

    let parsedData = {};
    try {
        parsedData = JSON.parse(resultText).data || JSON.parse(resultText); // handle { data: {...} } or raw JSON
    } catch (err) {
        console.error("Failed to parse AI JSON:", err);
        return <p className="text-red-500">Invalid resume data</p>;
    }

    return (
        <PDFDownloadLink
            document={<ResumePDF data={parsedData} />}
            fileName="optimized_resume.pdf"
            className="flex items-center justify-center space-x-2 w-full h-full"
        >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
    );
};
