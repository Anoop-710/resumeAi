// File: components/JobResumeOptimizer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, ChevronRight, FileDown } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { downloadAsDOCX, postFormData } from '../utils/resumeUtils';
import { PDFDownloadButton } from './PDFDownloadButton';

export default function JobResumeOptimizer() {
    const { darkMode } = useDarkMode();

    const [files, setFiles] = useState<{ resume2: File | null; jobDescription: File | null }>({ resume2: null, jobDescription: null });
    const [useFileUpload2, setUseFileUpload2] = useState(true);
    const [useFileUpload3, setUseFileUpload3] = useState(true);
    const [resume2Text, setResume2Text] = useState('');
    const [jobDescriptionText, setJobDescriptionText] = useState('');

    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (key: 'resume2' | 'jobDescription') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFiles(prev => ({ ...prev, [key]: f }));
    };

    const handleSubmit = async () => {
        setError('');
        setResultText('');
        setLoading(true);

        try {
            const formData = new FormData();

            // resume2
            if (useFileUpload2) {
                if (!files.resume2) {
                    setError('Please upload a resume file for the job-optimization flow.');
                    setLoading(false);
                    return;
                }
                formData.append('resume', files.resume2, files.resume2.name);
            } else {
                if (!resume2Text.trim()) {
                    setError('Please paste resume text or choose upload for the job-optimization flow.');
                    setLoading(false);
                    return;
                }
                const blob = new Blob([resume2Text], { type: 'text/plain' });
                const f = new File([blob], 'resume.txt', { type: 'text/plain' });
                formData.append('resume', f);
            }

            // jd
            if (useFileUpload3) {
                if (!files.jobDescription) {
                    setError('Please upload a job description file.');
                    setLoading(false);
                    return;
                }
                formData.append('jd', files.jobDescription, files.jobDescription.name);
            } else {
                if (!jobDescriptionText.trim()) {
                    setError('Please paste job description text or choose upload.');
                    setLoading(false);
                    return;
                }
                const blob = new Blob([jobDescriptionText], { type: 'text/plain' });
                const f = new File([blob], 'jd.txt', { type: 'text/plain' });
                formData.append('jd', f);
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
        setFiles({ resume2: null, jobDescription: null });
        setResume2Text('');
        setJobDescriptionText('');
        setResultText('');
        setError('');
        setLoading(false);
    };

    return (
        <motion.div
            className={`${darkMode ? 'bg-emerald-950/50 border-emerald-500/20' : 'bg-white/80 border-emerald-200'} rounded-2xl shadow-xl border p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`hidden sm:flex p-3 rounded-xl ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-indigo-600'}`}>
                    <FileText className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Optimize Resume for a Job</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 sm:mb-6 text-base sm:text-lg`}>Upload your resume and a job description. Get a version tailored for the JD with relevant skills highlighted and keywords optimized.</p>

                    <div className="space-y-6 mb-6">
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Resume</label>

                            <div className="flex space-x-4 mb-4">
                                <button type="button" onClick={() => { setUseFileUpload2(true); setResume2Text(''); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${useFileUpload2 ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}>Upload File</button>
                                <button type="button" onClick={() => { setUseFileUpload2(false); setFiles(prev => ({ ...prev, resume2: null })); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${!useFileUpload2 ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}>Paste Text</button>
                            </div>

                            {useFileUpload2 ? (
                                <div className="relative">
                                    <input id="resume-upload-2" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange('resume2')} className="hidden" />
                                    <label htmlFor="resume-upload-2" className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${darkMode ? 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10' : 'border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'} rounded-xl transition-all duration-300 cursor-pointer`}>
                                        <Upload className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} mr-2`} />
                                        <span className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'}`}>{files.resume2 ? files.resume2.name : 'Choose resume file or drag and drop'}</span>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <textarea value={resume2Text} onChange={(e) => setResume2Text(e.target.value)} placeholder="Paste your resume content here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none ${darkMode ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 placeholder-emerald-400/60' : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500'}`} rows={6} />
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-emerald-400' : 'text-gray-500'}`}>{resume2Text.length} characters</p>
                                </div>

                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job Description</label>

                            <div className="flex space-x-4 mb-4">
                                <button type="button" onClick={() => { setUseFileUpload3(true); setJobDescriptionText(''); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${useFileUpload3 ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}>Upload File</button>
                                <button type="button" onClick={() => { setUseFileUpload3(false); setFiles(prev => ({ ...prev, jobDescription: null })); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${!useFileUpload3 ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}>Paste Text</button>
                            </div>

                            {useFileUpload3 ? (
                                <div className="relative">
                                    <input id="jd-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange('jobDescription')} className="hidden" />
                                    <label htmlFor="jd-upload" className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${darkMode ? 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10' : 'border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'} rounded-xl transition-all duration-300 cursor-pointer`}>
                                        <FileText className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} mr-2`} />
                                        <span className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'}`}>{files.jobDescription ? files.jobDescription.name : 'Choose job description file or drag and drop'}</span>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <textarea value={jobDescriptionText} onChange={(e) => setJobDescriptionText(e.target.value)} placeholder="Paste the job description here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none ${darkMode ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 placeholder-emerald-400/60' : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500'}`} rows={6} />
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-emerald-400' : 'text-gray-500'}`}>{jobDescriptionText.length} characters</p>
                                </div>

                            )}

                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <motion.button onClick={handleSubmit} disabled={loading || !!resultText || (useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim())} className={`w-full px-6 sm:px-8 py-4 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${loading || !!resultText || (useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim()) ? 'opacity-50 cursor-not-allowed bg-gray-400' : (darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl')} text-white`} whileHover={{ scale: loading || !!resultText || (useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim()) ? 1 : 1.05 }} whileTap={{ scale: loading || !!resultText || (useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim()) ? 1 : 0.95 }}>
                            <span className="text-sm sm:text-base">{loading ? 'Processing...' : resultText ? 'Resume Optimized' : 'Optimize for Job'}</span>
                            {loading ? (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : resultText ? (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-200">✓</div>
                            ) : (
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            )}
                        </motion.button>

                        {resultText && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <motion.button className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl'} text-white`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <PDFDownloadButton resultText={resultText} />
                                </motion.button>

                                <motion.button onClick={() => downloadAsDOCX(resultText)} className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl'} text-white`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">Download DOCX</span>
                                </motion.button>

                                <motion.button onClick={handleReset} className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-400/50' : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300'} backdrop-blur-sm`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <span className="text-sm">🔄</span>
                                    <span className="text-sm sm:text-base">Optimize Another</span>
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {loading && <p className="text-gray-500 mt-2">Processing...</p>}
                    {resultText && <pre className={`mt-4 whitespace-pre-wrap ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{resultText}</pre>}

                </div>
            </div>
        </motion.div>
    );
}
