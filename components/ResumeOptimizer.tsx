// File: components/ResumeOptimizer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronRight, FileDown, Copy, Check } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { downloadAsDOCX, postFormData } from '../utils/resumeUtils';
import { PDFDownloadButton } from './PDFDownloadButton';

// Type definitions for resume data
interface ContactInfo {
    email?: string;
    phone?: string;
    linkedin?: string;
    address?: string;
    portfolio?: string;
}

interface Skills {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    concepts?: string[];
}

interface Experience {
    title?: string;
    company?: string;
    dates?: string;
    description?: string[];
}

interface Education {
    degree?: string;
    university?: string;
    graduationDate?: string;
}

interface Project {
    name?: string;
    description?: string;
}

interface ResumeData {
    name?: string;
    contact?: ContactInfo;
    summary?: string;
    skills?: Skills;
    experience?: Experience[];
    education?: Education[];
    projects?: Project[];
    achievements?: string[];
    hobbies?: string[];
    languages?: string[];
}

// Helper function to format resume JSON data to readable text
function formatResumeData(data: ResumeData | unknown): string {
    if (!data || typeof data !== 'object') {
        return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }

    // Type assertion for the data object
    const resumeData = data as ResumeData;
    let formatted = '';

    // Name
    if (resumeData.name) {
        formatted += `${resumeData.name}\n${'='.repeat(resumeData.name.length)}\n\n`;
    }

    // Contact Information
    if (resumeData.contact) {
        formatted += 'CONTACT INFORMATION\n';
        formatted += '--------------------\n';
        if (resumeData.contact.email) formatted += `Email: ${resumeData.contact.email}\n`;
        if (resumeData.contact.phone) formatted += `Phone: ${resumeData.contact.phone}\n`;
        if (resumeData.contact.linkedin) formatted += `LinkedIn: ${resumeData.contact.linkedin}\n`;
        if (resumeData.contact.address) formatted += `Address: ${resumeData.contact.address}\n`;
        if (resumeData.contact.portfolio) formatted += `Portfolio: ${resumeData.contact.portfolio}\n`;
        formatted += '\n';
    }

    // Summary
    if (resumeData.summary) {
        formatted += 'PROFESSIONAL SUMMARY\n';
        formatted += '--------------------\n';
        formatted += `${resumeData.summary}\n\n`;
    }

    // Skills
    if (resumeData.skills) {
        formatted += 'SKILLS\n';
        formatted += '------\n';

        const skills = resumeData.skills;
        if (skills.languages && skills.languages.length > 0) {
            formatted += `Languages: ${skills.languages.join(', ')}\n`;
        }
        if (skills.frameworks && skills.frameworks.length > 0) {
            formatted += `Frameworks: ${skills.frameworks.join(', ')}\n`;
        }
        if (skills.databases && skills.databases.length > 0) {
            formatted += `Databases: ${skills.databases.join(', ')}\n`;
        }
        if (skills.tools && skills.tools.length > 0) {
            formatted += `Tools: ${skills.tools.join(', ')}\n`;
        }
        if (skills.concepts && skills.concepts.length > 0) {
            formatted += `Concepts: ${skills.concepts.join(', ')}\n`;
        }
        formatted += '\n';
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        formatted += 'PROFESSIONAL EXPERIENCE\n';
        formatted += '-----------------------\n';

        resumeData.experience.forEach((exp: Experience, index: number) => {
            if (exp.title || exp.company) {
                formatted += `${index + 1}. `;
                if (exp.title) formatted += `${exp.title}`;
                if (exp.company) formatted += ` at ${exp.company}`;
                if (exp.dates) formatted += ` (${exp.dates})`;
                formatted += '\n';

                if (exp.description && exp.description.length > 0) {
                    exp.description.forEach((desc: string) => {
                        formatted += `   • ${desc}\n`;
                    });
                }
                formatted += '\n';
            }
        });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        formatted += 'EDUCATION\n';
        formatted += '---------\n';

        resumeData.education.forEach((edu: Education, index: number) => {
            if (edu.degree || edu.university) {
                formatted += `${index + 1}. `;
                if (edu.degree) formatted += `${edu.degree}`;
                if (edu.university) formatted += ` - ${edu.university}`;
                if (edu.graduationDate) formatted += ` (${edu.graduationDate})`;
                formatted += '\n';
            }
        });
        formatted += '\n';
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
        formatted += 'PROJECTS\n';
        formatted += '--------\n';

        resumeData.projects.forEach((project: Project, index: number) => {
            if (project.name || project.description) {
                formatted += `${index + 1}. `;
                if (project.name) formatted += `${project.name}`;
                formatted += '\n';
                if (project.description) formatted += `   ${project.description}\n`;
                formatted += '\n';
            }
        });
    }

    // Achievements
    if (resumeData.achievements && resumeData.achievements.length > 0) {
        formatted += 'ACHIEVEMENTS\n';
        formatted += '------------\n';
        resumeData.achievements.forEach((achievement: string) => {
            formatted += `• ${achievement}\n`;
        });
        formatted += '\n';
    }

    // Hobbies
    if (resumeData.hobbies && resumeData.hobbies.length > 0) {
        formatted += 'HOBBIES & INTERESTS\n';
        formatted += '-------------------\n';
        formatted += `${resumeData.hobbies.join(', ')}\n\n`;
    }

    // Languages
    if (resumeData.languages && resumeData.languages.length > 0) {
        formatted += 'LANGUAGES\n';
        formatted += '---------\n';
        formatted += `${resumeData.languages.join(', ')}\n\n`;
    }

    return formatted.trim();
}

export default function ResumeOptimizer() {
    const { darkMode } = useDarkMode();

    const [files, setFiles] = useState<{ resume: File | null }>({ resume: null });
    const [useFileUpload, setUseFileUpload] = useState(true);
    const [resumeText, setResumeText] = useState('');

    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [resultData, setResultData] = useState<ResumeData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

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
            // Store raw data for PDF generation and format text for display
            const resumeData = data.data || data;
            setResultData(resumeData);
            const formattedText = formatResumeData(resumeData);
            setResultText(formattedText);
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
        setResultData(null);
        setError('');
        setLoading(false);
        setCopied(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resultText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <motion.div
            className={`${darkMode ? 'bg-emerald-950/50 border-emerald-500/20' : 'bg-white/80 border-emerald-200'} rounded-2xl shadow-xl border p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`hidden sm:flex p-3 rounded-xl ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-indigo-600'}`}>
                    <Upload className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Optimize Your Resume</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 sm:mb-6 text-base sm:text-lg`}>Upload your resume (PDF/DOCX or text) and get a polished, professional version with improved formatting and content optimization.</p>

                    <div className="space-y-4">
                        <div className="flex space-x-4 mb-4">
                            <button
                                type="button"
                                onClick={() => { setUseFileUpload(true); setResumeText(''); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${useFileUpload ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}
                            >
                                Upload File
                            </button>

                            <button
                                type="button"
                                onClick={() => { setUseFileUpload(false); setFiles(prev => ({ ...prev, resume: null })); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${!useFileUpload ? (darkMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md') : `${darkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}`}
                            >
                                Paste Text
                            </button>
                        </div>

                        {useFileUpload ? (
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Upload Resume (PDF/DOCX/TXT)</label>
                                <div className="relative">
                                    <input id="resume-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
                                    <label htmlFor="resume-upload" className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed ${darkMode ? 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10' : 'border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'} rounded-xl transition-all duration-300 cursor-pointer`}>
                                        <Upload className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} mr-2`} />
                                        <span className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'}`}>{files.resume ? files.resume.name : 'Choose file or drag and drop'}</span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Paste Your Resume Text</label>
                                <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here..." className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none ${darkMode ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 placeholder-emerald-400/60' : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500'}`} rows={8} />
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{resumeText.length} characters</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <motion.button onClick={handleSubmit} disabled={loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim())} className={`w-full px-6 sm:px-8 py-4 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 'opacity-50 cursor-not-allowed bg-gray-400' : (darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 hover:shadow-2xl' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 hover:shadow-2xl')} text-white`} whileHover={{ scale: loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 1 : 1.05 }} whileTap={{ scale: loading || !!resultText || (useFileUpload ? !files.resume : !resumeText.trim()) ? 1 : 0.95 }}>
                                <span className="text-sm sm:text-base">{loading ? 'Processing...' : resultText ? 'Resume Optimized' : 'Optimize Resume'}</span>
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
                                        <PDFDownloadButton resultData={resultData} />
                                    </motion.button>

                                    <motion.button onClick={handleReset} className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${darkMode ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-400/50' : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300'} backdrop-blur-sm`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <span className="text-sm">🔄</span>
                                        <span className="text-sm sm:text-base">Optimize Another</span>
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        {resultText && (
                            <div className="relative mt-4">
                                <div className="absolute top-2 right-2 z-10">
                                    <motion.button
                                        onClick={handleCopy}
                                        className={`p-2 rounded-lg transition-all duration-200 ${darkMode
                                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </motion.button>
                                </div>
                                <pre className={`whitespace-pre-wrap p-4 rounded-xl border ${darkMode
                                        ? 'bg-emerald-950/30 border-emerald-500/30 text-gray-100'
                                        : 'bg-gray-50 border-gray-200 text-gray-800'
                                    }`}>
                                    {resultText}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
