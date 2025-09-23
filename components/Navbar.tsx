'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Navbar() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navLinks = ['Home', 'About', 'Pricing'];

    return (
        <nav className={`${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50 shadow-sm transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Resume Builder
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`}
                                    className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors duration-200 relative group`}
                                >
                                    {link}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} group-hover:w-full transition-all duration-200`}></span>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Dark Mode Toggle */}
                        <motion.button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </motion.button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition-colors duration-200`}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`md:hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}
                    >
                        <div className="px-4 py-2 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link}
                                    href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`}
                                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
