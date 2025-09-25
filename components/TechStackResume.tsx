// File: components/TechStackResume.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, ChevronRight, FileDown } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { downloadAsDOCX, postFormData } from '../utils/resumeUtils';
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

    const handleReset = () => {
        setTechStack('');
        setResultText('');
        setError('');
        setLoading(false);
    };

    return (
        <motion.div
            className={`${darkMode ? 'bg-emerald-950/50 border-emerald-500/20' : 'bg-white/80 border-emerald-200'} rounded-2xl shadow-xl border p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`hidden sm:flex p-3 rounded-xl ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-indigo-600'}`}>
                    <Code className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Generate Resume from Skills</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 sm:mb-6 text-base sm:text-lg`}>No resume? No problem! Enter your tech stack or skills and generate a professional resume from scratch with AI-powered content creation.</p>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Enter Your Tech Stack & Skills</label>
                            <textarea value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Enter at least 50 characters describing your tech stack and skills (e.g., React, Node.js, Python, AWS, Machine Learning, Product Management, etc.)" className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none ${darkMode ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 placeholder-emerald-400/60' : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500'}`} rows={4} />
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{techStack.length}/50 characters minimum</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <motion.button onClick={handleSubmit} disabled={loading || !!resultText || techStack.length < 50} className={`w-full px-6 sm:px-8 py-4 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${loading || !!resultText || techStack.length < 50 ? 'opacity-50 cursor-not-allowed bg-gray-400' : (darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl')} text-white`} whileHover={{ scale: loading || !!resultText || techStack.length < 50 ? 1 : 1.05 }} whileTap={{ scale: loading || !!resultText || techStack.length < 50 ? 1 : 0.95 }}>
                                <span className="text-sm sm:text-base">{loading ? 'Processing...' : resultText ? 'Resume Generated' : 'Generate Resume'}</span>
                                {loading ? (
                                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : resultText ? (
                                    <div className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-200">✓</div>
                                ) : (
                                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                )}
                            </motion.button>

                            {resultText && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <motion.button className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl'} text-white`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <PDFDownloadButton resultText={resultText} />
                                    </motion.button>

                                    <motion.button onClick={handleReset} className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-400/50' : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300'} backdrop-blur-sm`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <span className="text-sm">🔄</span>
                                        <span className="text-sm sm:text-base">Generate Another</span>
                                    </motion.button>
                                </div>
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
