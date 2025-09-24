// File: components/ResumeOptimizer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronRight, FileDown } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { postFormData, downloadAsDOCX } from '../utils/resumeUtils';
import { PDFDownloadButton } from './PDFDownloadButton';

export default function ResumeOptimizer() {
    const { darkMode } = useDarkMode();

    const [files, setFiles] = useState<{ resume: File | null }>({ resume: null });
    const [useFileUpload, setUseFileUpload] = useState(true);
    const [resumeText, setResumeText] = useState('');

    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFiles(prev => ({ ...prev, resume: f }));
    };

    const handleSubmit = async () => {
        setError('');
        setResultText('');
        setLoading(true);

        try {
            const formData = new FormData();

            if (useFileUpload) {
                if (!files.resume) {
                    setError('Please upload a resume file.');
                    setLoading(false);
                    return;
                }
                formData.append('resume', files.resume, files.resume.name);
            } else {
                if (!resumeText.trim()) {
                    setError('Please paste resume text or choose upload.');
                    setLoading(false);
                    return;
                }
                const blob = new Blob([resumeText], { type: 'text/plain' });
                const f = new File([blob], 'resume.txt', { type: 'text/plain' });
                formData.append('resume', f);
            }

            const data = await postFormData('/api/polishResume', formData);
            setResultText(data.text ?? JSON.stringify(data));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFiles({ resume: null });
        setResumeText('');
        setResultText('');
        setError('');
        setLoading(false);
    };

    return (
        <motion.div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                    <Upload className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Optimize Your Resume</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>Upload your resume (PDF/DOCX or text) and get a polished, professional version with improved formatting and content optimization.</p>

                    <div className="space-y-4">
                        <div className="flex space-x-4 mb-4">
                            <button
                                type="button"
                                onClick={() => { setUseFileUpload(true); setResumeText(''); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload ? 'bg-green-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}
                            >
                                Upload File
                            </button>

                            <button
                                type="button"
                                onClick={() => { setUseFileUpload(false); setFiles(prev => ({ ...prev, resume: null })); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload ? 'bg-green-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}
                            >
                                Paste Text
                            </button>
                        </div>

                        {useFileUpload ? (
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Upload Resume (PDF/DOCX/TXT)</label>
                                <div className="relative">
                                    <input id="resume-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
                                    <label htmlFor="resume-upload" className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} rounded-xl transition-all duration-200 cursor-pointer`}>
                                        <Upload className={`h-5 w-5 text-gray-400 mr-2`} />
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{files.resume ? files.resume.name : 'Choose file or drag and drop'}</span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Paste Your Resume Text</label>
                                <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={8} />
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{resumeText.length} characters</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button onClick={handleSubmit} disabled={loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim())} className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'} text-white`} whileHover={{ scale: loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 1 : 1.05 }} whileTap={{ scale: loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 1 : 0.95 }}>
                                <span>{loading ? 'Processing...' : resultText ? 'Resume Optimized' : 'Optimize Resume'}</span>
                                {loading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : resultText ? (
                                    <div className="h-5 w-5 text-green-200">✓</div>
                                ) : (
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                )}
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

                                    <motion.button onClick={handleReset} className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-gray-500 to-gray-600 hover:shadow-lg text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <span className="text-sm">🔄</span>
                                        <span className="hidden sm:inline">Optimize Another</span>
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        {resultText && <pre className={`mt-4 whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{resultText}</pre>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
