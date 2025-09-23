'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Code, ChevronRight, Download, FileDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Home() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [files, setFiles] = useState({
    resume: null as File | null,
    resume2: null as File | null,
    jobDescription: null as File | null
  });
  const [techStack, setTechStack] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(true);
  const [resume2Text, setResume2Text] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [useFileUpload2, setUseFileUpload2] = useState(true);
  const [useFileUpload3, setUseFileUpload3] = useState(true);

  // New state for request/response UI
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  // ---------- NEW: handleSubmit that actually calls your API ----------
  const handleSubmit = async (section: string) => {
    setError('');
    setResultText('');
    setLoading(true);

    try {
      const formData = new FormData();

      if (section === 'resume-optimization') {
        // resume (file or pasted text)
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
          const file = new File([blob], 'resume.txt', { type: 'text/plain' });
          formData.append('resume', file);
        }
      } else if (section === 'jd-optimization') {
        // resume2 + jobDescription
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

        if (useFileUpload3) {
          if (!files.jobDescription) {
            setError('Please upload a job description file.');
            setLoading(false);
            return;
          }
          // server expects 'jd' (or 'jobDescription' depending on your server) â€” we use 'jd'
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
      } else if (section === 'tech-stack-resume') {
        if (!techStack.trim()) {
          setError('Please enter your tech stack or skills.');
          setLoading(false);
          return;
        }
        formData.append('techStack', techStack);
      } else {
        setError('Unknown action');
        setLoading(false);
        return;
      }

      // send to your server route
      const res = await fetch("/api/polishResume", { method: "POST", body: formData });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} ${text}`);
      }

      const data = await res.json();
      // server returns { text: "<polished resume>" }
      setResultText(data.text ?? JSON.stringify(data));
    } catch (err: unknown) {
      console.error('submit error', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Download functions
  const downloadAsPDF = () => {
    if (!resultText) return;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3 {
              color: #2c3e50;
              margin-top: 20px;
            }
            .section {
              margin-bottom: 25px;
            }
            .contact-info {
              margin-bottom: 20px;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin: 10px 0;
            }
            .skill {
              background: #ecf0f1;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: 'Georgia', serif; font-size: 14px; line-height: 1.6;">${resultText}</pre>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print as PDF
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const downloadAsDOCX = () => {
    if (!resultText) return;

    // Create a simple HTML structure for DOCX
    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotShowInsertionsAndDeletions/></w:WordDocument></xml><![endif]-->
          <style>
            body { font-family: 'Georgia', serif; font-size: 12pt; line-height: 1.4; margin: 1in; }
            h1, h2, h3 { color: #2c3e50; margin: 12pt 0 6pt 0; }
            p { margin: 6pt 0; }
            .section { margin-bottom: 18pt; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: 'Georgia', serif; font-size: 12pt; line-height: 1.4;">${resultText}</pre>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------------

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero darkMode={darkMode} />

        {/* Main Sections */}
        <div className="space-y-8">
          {/* Section 1... (keeps your existing UI) */}
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
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>
                  Upload your resume (PDF/DOCX or text) and get a polished, professional version
                  with improved formatting and content optimization.
                </p>

                <div className="space-y-4">
                  {/* Method Selection */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setUseFileUpload(true);
                        setResumeText('');
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload
                        ? 'bg-green-600 text-white shadow-md'
                        : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                        }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseFileUpload(false);
                        setFiles(prev => ({ ...prev, resume: null }));
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload
                        ? 'bg-green-600 text-white shadow-md'
                        : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                        }`}
                    >
                      Paste Text
                    </button>
                  </div>

                  {/* File Upload Section */}
                  {useFileUpload && (
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Upload Resume (PDF/DOCX/TXT)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => handleFileUpload('resume', e)}
                          className="hidden"
                          id="resume-upload"
                          disabled={!useFileUpload}
                        />
                        <label
                          htmlFor="resume-upload"
                          className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed ${!useFileUpload
                            ? 'border-gray-400 cursor-not-allowed opacity-50'
                            : darkMode
                              ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            } rounded-xl transition-all duration-200 ${!useFileUpload ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                        >
                          <Upload className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {files.resume ? files.resume.name : 'Choose file or drag and drop'}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Text Input Section */}
                  {!useFileUpload && (
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Paste Your Resume Text
                      </label>
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume content here..."
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        rows={8}
                        disabled={useFileUpload}
                      />
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {resumeText.length} characters
                      </p>
                    </div>
                  )}

                  {/* Action Buttons Container */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => handleSubmit('resume-optimization')}
                      disabled={useFileUpload ? !files.resume : !resumeText.trim()}
                      className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${useFileUpload
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        } text-white ${(useFileUpload ? !files.resume : !resumeText.trim())
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg'
                        }`}
                      whileHover={{
                        scale: (useFileUpload ? !!files.resume : !!resumeText.trim()) ? 1.05 : 1
                      }}
                      whileTap={{
                        scale: (useFileUpload ? !!files.resume : !!resumeText.trim()) ? 0.95 : 1
                      }}
                    >
                      <span >Optimize Resume</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>

                    {/* Download Buttons - Only show when there's result text */}
                    {resultText && (
                      <>
                        <motion.button
                          onClick={downloadAsPDF}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Download className="h-5 w-5" />
                          <span className="hidden sm:inline">Download PDF</span>
                        </motion.button>

                        <motion.button
                          onClick={downloadAsDOCX}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FileDown className="h-5 w-5" />
                          <span className="hidden sm:inline">Download DOCX</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: JD + Resume Optimization */}
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
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>
                  Upload your resume and a job description. Get a version tailored for the JD
                  with relevant skills highlighted and keywords optimized.
                </p>

                <div className="space-y-6 mb-6">
                  {/* Resume Section */}
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Resume
                    </label>

                    {/* Method Selection for Resume */}
                    <div className="flex space-x-4 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setUseFileUpload2(true);
                          setResume2Text('');
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload2
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                          }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUseFileUpload2(false);
                          setFiles(prev => ({ ...prev, resume2: null }));
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload2
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                          }`}
                      >
                        Paste Text
                      </button>
                    </div>

                    {/* File Upload for Resume */}
                    {useFileUpload2 && (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => handleFileUpload('resume2', e)}
                          className="hidden"
                          id="resume-upload-2"
                          disabled={!useFileUpload2}
                        />
                        <label
                          htmlFor="resume-upload-2"
                          className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${!useFileUpload2
                            ? 'border-gray-400 cursor-not-allowed opacity-50'
                            : darkMode
                              ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            } rounded-xl transition-all duration-200 ${!useFileUpload2 ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                        >
                          <Upload className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {files.resume2 ? files.resume2.name : 'Choose resume file or drag and drop'}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Text Input for Resume */}
                    {!useFileUpload2 && (
                      <div>
                        <textarea
                          value={resume2Text}
                          onChange={(e) => setResume2Text(e.target.value)}
                          placeholder="Paste your resume content here..."
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          rows={6}
                          disabled={useFileUpload2}
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {resume2Text.length} characters
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Job Description Section */}
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Job Description
                    </label>

                    {/* Method Selection for Job Description */}
                    <div className="flex space-x-4 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setUseFileUpload3(true);
                          setJobDescriptionText('');
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${useFileUpload3
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                          }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUseFileUpload3(false);
                          setFiles(prev => ({ ...prev, jobDescription: null }));
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${!useFileUpload3
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                          }`}
                      >
                        Paste Text
                      </button>
                    </div>

                    {/* File Upload for Job Description */}
                    {useFileUpload3 && (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => handleFileUpload('jobDescription', e)}
                          className="hidden"
                          id="jd-upload"
                          disabled={!useFileUpload3}
                        />
                        <label
                          htmlFor="jd-upload"
                          className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed ${!useFileUpload3
                            ? 'border-gray-400 cursor-not-allowed opacity-50'
                            : darkMode
                              ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            } rounded-xl transition-all duration-200 ${!useFileUpload3 ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                        >
                          <FileText className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {files.jobDescription ? files.jobDescription.name : 'Choose job description file or drag and drop'}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Text Input for Job Description */}
                    {!useFileUpload3 && (
                      <div>
                        <textarea
                          value={jobDescriptionText}
                          onChange={(e) => setJobDescriptionText(e.target.value)}
                          placeholder="Paste the job description here..."
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          rows={6}
                          disabled={useFileUpload3}
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {jobDescriptionText.length} characters
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons Container */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => handleSubmit('jd-optimization')}
                    disabled={
                      (useFileUpload2 ? !files.resume2 : !resume2Text.trim()) ||
                      (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim())
                    }
                    className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${(useFileUpload2 ? !files.resume2 : !resume2Text.trim()) ||
                      (useFileUpload3 ? !files.jobDescription : !jobDescriptionText.trim())
                      ? 'opacity-50 cursor-not-allowed bg-gray-400'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                      } text-white`}
                    whileHover={{
                      scale: ((useFileUpload2 ? !!files.resume2 : !!resume2Text.trim()) &&
                        (useFileUpload3 ? !!files.jobDescription : !!jobDescriptionText.trim())) ? 1.05 : 1
                    }}
                    whileTap={{
                      scale: ((useFileUpload2 ? !!files.resume2 : !!resume2Text.trim()) &&
                        (useFileUpload3 ? !!files.jobDescription : !!jobDescriptionText.trim())) ? 0.95 : 1
                    }}
                  >
                    <span>Optimize for Job</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>

                  {/* Download Buttons - Only show when there's result text */}
                  {resultText && (
                    <>
                      <motion.button
                        onClick={downloadAsPDF}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="h-5 w-5" />
                        <span className="hidden sm:inline">Download PDF</span>
                      </motion.button>

                      <motion.button
                        onClick={downloadAsDOCX}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FileDown className="h-5 w-5" />
                        <span className="hidden sm:inline">Download DOCX</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Build Resume from Tech Stack */}
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
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>
                  No resume? No problem! Enter your tech stack or skills and generate a
                  professional resume from scratch with AI-powered content creation.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Enter Your Tech Stack & Skills
                    </label>
                    <textarea
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="Enter at least 50 characters describing your tech stack and skills (e.g., React, Node.js, Python, AWS, Machine Learning, Product Management, etc.)"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      rows={4}
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {techStack.length}/50 characters minimum
                    </p>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => handleSubmit('tech-stack-resume')}
                      disabled={techStack.length < 50}
                      className={`flex-1 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${techStack.length < 50
                        ? 'opacity-50 cursor-not-allowed bg-gray-400'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                        } text-white ${techStack.length >= 50 ? 'hover:shadow-lg' : ''}`}
                      whileHover={{
                        scale: techStack.length >= 50 ? 1.05 : 1
                      }}
                      whileTap={{
                        scale: techStack.length >= 50 ? 0.95 : 1
                      }}
                    >
                      <span>Generate Resume</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>

                    {/* Download Buttons - Only show when there's result text */}
                    {resultText && (
                      <>
                        <motion.button
                          onClick={downloadAsPDF}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Download className="h-5 w-5" />
                          <span className="hidden sm:inline">Download PDF</span>
                        </motion.button>

                        <motion.button
                          onClick={downloadAsDOCX}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FileDown className="h-5 w-5" />
                          <span className="hidden sm:inline">Download DOCX</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
