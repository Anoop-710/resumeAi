// File: components/JobResumeOptimizer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, ChevronRight, FileDown, Download } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { postFormData, downloadAsDOCX } from '../utils/resumeUtils';
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

    return (
        <motion.div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                    <FileText className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Optimize Resume for a Job</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>Upload your resume and a job description. Get a version tailored for the JD with relevant skills highlighted and keywords optimized.</p>

                    <div className="space-y-6 mb-6">
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Resume</label>

                            <div className="flex space-x-4 mb-4">
                                <button type="button" onClick={() => { setUseFileUpload2(true); setResume2Text(''); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload2 ? 'bg-blue-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}>Upload File</button>
                                <button type="button" onClick={() => { setUseFileUpload2(false); setFiles(prev => ({ ...prev, resume2: null })); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload2 ? 'bg-blue-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}>Paste Text</button>
                            </div>

                            {useFileUpload2 ? (
                                <div className="relative">
                                    <input id="resume-upload-2" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange('resume2')} className="hidden" />
                                    <label htmlFor="resume-upload-2" className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} rounded-xl transition-all duration-200 cursor-pointer`}>
                                        <Upload className={`h-4 w-4 text-gray-400 mr-2`} />
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{files.resume2 ? files.resume2.name : 'Choose resume file or drag and drop'}</span>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <textarea value={resume2Text} onChange={(e) => setResume2Text(e.target.value)} placeholder="Paste your resume content here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={6} />
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{resume2Text.length} characters</p>
                                </div>

                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job Description</label>

                            <div className="flex space-x-4 mb-4">
                                <button type="button" onClick={() => { setUseFileUpload3(true); setJobDescriptionText(''); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload3 ? 'bg-blue-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}>Upload File</button>
                                <button type="button" onClick={() => { setUseFileUpload3(false); setFiles(prev => ({ ...prev, jobDescription: null })); }} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload3 ? 'bg-blue-600 text-white shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}>Paste Text</button>
                            </div>

                            {useFileUpload3 ? (
                                <div className="relative">
                                    <input id="jd-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange('jobDescription')} className="hidden" />
                                    <label htmlFor="jd-upload" className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} rounded-xl transition-all duration-200 cursor-pointer`}>
                                        <FileText className={`h-4 w-4 text-gray-400 mr-2`} />
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{files.jobDescription ? files.jobDescription.name : 'Choose job description file or drag and drop'}</span>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <textarea value={jobDescriptionText} onChange={(e) => setJobDescriptionText(e.target.value)} placeholder="Paste the job description here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={6} />
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{jobDescriptionText.length} characters</p>
                                </div>

                            )}

                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button onClick={handleSubmit} disabled={(useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim())} className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${((useFileUpload2 ? !files.resume2 : !resume2Text.trim()) || (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim())) ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg'} text-white`} whileHover={{ scale: ((useFileUpload2 ? !!files.resume2 : !!resume2Text.trim()) && (useFileUpload3 ? !!files.jobDescription : !!jobDescriptionText.trim())) ? 1.05 : 1 }} whileTap={{ scale: ((useFileUpload2 ? !!files.resume2 : !!resume2Text.trim()) && (useFileUpload3 ? !!files.jobDescription : !!jobDescriptionText.trim())) ? 0.95 : 1 }}>
                            <span>Optimize for Job</span>
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
        </motion.div>
    );
}
