'use client';

import { motion } from 'framer-motion';
import { Users, Target, Heart, Lightbulb, Rocket } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function AboutPage() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    const values = [
        {
            icon: Target,
            title: 'Precision',
            description: 'We use advanced AI to ensure every resume is perfectly tailored to the job requirements and passes ATS systems.'
        },
        {
            icon: Heart,
            title: 'Empathy',
            description: 'We understand the challenges of job searching and career transitions, so we build tools that truly help people succeed.'
        },
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We continuously improve our AI models and user experience to stay ahead of industry trends and best practices.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We believe in supporting job seekers at every stage of their career journey, from entry-level to executive positions.'
        }
    ];

    const stats = [
        { number: '500+', label: 'Resumes Optimized' },
        { number: '95%', label: 'ATS Pass Rate' },
        { number: '4.7/5', label: 'User Rating' }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                            About Our
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Mission
                            </span>
                        </h1>
                        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
                            We&apos;re on a mission to democratize access to professional resume optimization through AI.
                            Every job seeker deserves a fighting chance, regardless of their background or experience level.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                            >
                                <div className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                                    {stat.number}
                                </div>
                                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                            Ready to Transform Your Career?
                        </h2>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-8`}>
                            Join thousands of professionals who have already improved their resumes with our AI-powered platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>
                                    <Link href="/">
                                        Get Started
                                    </Link>
                                </span>
                                <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                            <motion.button
                                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/pricing">
                                    View Pricing
                                </Link>

                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer darkMode={darkMode} />
        </div>
    );
}
