// File: components/TechStackResume.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, ChevronRight, FileDown, Download } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { postFormData, downloadAsDOCX } from '../utils/resumeUtils';
import { PDFDownloadButton } from './PDFDownloadButton';

export default function TechStackResume() {
    const { darkMode } = useDarkMode();

    const [techStack, setTechStack] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        setResultText('');
        setLoading(true);

        try {
            if (!techStack.trim()) {
                setError('Please enter your tech stack or skills.');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('techStack', techStack);

            const data = await postFormData('/api/polishResume', formData);
            setResultText(data.text ?? JSON.stringify(data));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                    <Code className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Generate Resume from Skills</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>No resume? No problem! Enter your tech stack or skills and generate a professional resume from scratch with AI-powered content creation.</p>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Enter Your Tech Stack & Skills</label>
                            <textarea value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Enter at least 50 characters describing your tech stack and skills (e.g., React, Node.js, Python, AWS, Machine Learning, Product Management, etc.)" className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={4} />
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{techStack.length}/50 characters minimum</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button onClick={handleSubmit} disabled={techStack.length < 50} className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${techStack.length < 50 ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg'} text-white`} whileHover={{ scale: techStack.length >= 50 ? 1.05 : 1 }} whileTap={{ scale: techStack.length >= 50 ? 0.95 : 1 }}>
                                <span>Generate Resume</span>
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>

                            {resultText && (
                                <>
                                    <div className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white">
                                        <PDFDownloadButton resultText={resultText} />
                                    </div>

                                    <motion.button onClick={() => downloadAsDOCX(resultText)} className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <FileDown className="h-5 w-5" />
                                        <span className="hidden sm:inline">Download DOCX</span>
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {loading && <p className="text-gray-500 mt-2">Processing...</p>}
                        {resultText && <pre className={`mt-4 whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{resultText}</pre>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
