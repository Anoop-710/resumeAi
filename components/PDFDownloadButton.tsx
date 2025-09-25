'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';

interface PDFDownloadButtonProps {
    resultData: any; // raw data from AI API
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ resultData }) => {
    if (!resultData) return null;

    return (
        <PDFDownloadLink
            document={<ResumePDF data={resultData} />}
            fileName="optimized_resume.pdf"
            className="flex items-center justify-center space-x-2 w-full h-full"
        >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
    );
};
