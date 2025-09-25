// File: components/TechStackResume.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, ChevronRight, FileDown } from 'lucide-react';
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

export default function TechStackResume() {
    const { darkMode } = useDarkMode();

    const [techStack, setTechStack] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [resultData, setResultData] = useState<ResumeData | null>(null);
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
                                        <PDFDownloadButton resultData={resultData} />
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
