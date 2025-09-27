'use client';

import { motion } from 'framer-motion';
import { Target, Rocket, Star, Award, TrendingUp, Zap } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function AboutPage() {
    const { darkMode } = useDarkMode();

    const stats = [
        { number: '500+', label: 'Resumes Optimized', icon: TrendingUp },
        { number: '98%', label: 'ATS Pass Rate', icon: Target },
        { number: '4.7/5', label: 'User Rating', icon: Star }
    ];

    const features = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Get your optimized resume in under 30 seconds with our advanced AI processing.'
        },
        {
            icon: Award,
            title: 'Industry Leading',
            description: 'We use cutting-edge AI technology to optimize resumes for top-tier companies.'
        },
        {
            icon: Target,
            title: 'ATS Optimized',
            description: 'Every resume is crafted to pass Applicant Tracking Systems with flying colors.'
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-emerald-950 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-emerald-100'}`}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${darkMode
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}
                        >
                            <Star className="h-4 w-4 mr-2" />
                            Transforming Careers with AI
                        </motion.div>

                        <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'} block`}>
                                About Our
                            </span>
                            <span className={`block bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-indigo-400' : 'from-emerald-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                Mission
                            </span>
                        </h1>

                        <motion.p
                            className={`text-xl md:text-2xl ${darkMode ? 'text-emerald-100' : 'text-gray-600'} mb-12 max-w-4xl mx-auto leading-relaxed`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            We&apos;re on a mission to democratize access to professional resume optimization through AI.
                            Every job seeker deserves a fighting chance, regardless of their background or experience level.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.button
                                className={`bg-gradient-to-r ${darkMode ? 'from-emerald-500 to-indigo-600' : 'from-emerald-600 to-indigo-600'} text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group min-w-[200px]`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>
                                    <Link href="/">
                                        Get Started Free
                                    </Link>
                                </span>
                                <Rocket className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                            <motion.button
                                className={`px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 min-w-[200px] ${darkMode
                                    ? 'bg-gray-800/50 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400/50'
                                    : 'bg-white/80 text-gray-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                                    } backdrop-blur-sm`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/pricing">
                                    View Pricing
                                </Link>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-indigo-500/5"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Trusted by Professionals
                        </h2>
                        <p className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'} text-lg`}>
                            Join thousands who have transformed their careers
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className={`relative group text-center p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 ${darkMode
                                        ? 'bg-gray-800/50 border border-emerald-500/20 hover:border-emerald-400/40'
                                        : 'bg-white/80 border border-emerald-200 hover:border-emerald-300'
                                        } shadow-xl hover:shadow-2xl`}
                                >
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${darkMode ? 'from-emerald-500 to-indigo-600' : 'from-emerald-600 to-indigo-600'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="h-8 w-8" />
                                    </div>
                                    <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-indigo-400' : 'from-emerald-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                        {stat.number}
                                    </div>
                                    <div className={`font-semibold text-lg ${darkMode ? 'text-emerald-200' : 'text-gray-700'}`}>
                                        {stat.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-emerald-500/5"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Why Choose
                            <span className={`block bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-indigo-400' : 'from-emerald-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                Our Platform?
                            </span>
                        </h2>
                        <p className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'} text-xl max-w-3xl mx-auto`}>
                            Experience the future of resume optimization
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    className={`group text-center p-8 rounded-2xl transition-all duration-300 ${darkMode
                                        ? 'bg-gray-800/30 border border-emerald-500/20 hover:border-emerald-400/40'
                                        : 'bg-white/60 border border-emerald-200 hover:border-emerald-300'
                                        } backdrop-blur-sm hover:shadow-2xl`}
                                >
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${darkMode ? 'from-emerald-500 to-indigo-600' : 'from-emerald-600 to-indigo-600'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="h-8 w-8" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`${darkMode ? 'text-emerald-200' : 'text-gray-600'} leading-relaxed`}>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/5 to-emerald-500/10"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`inline-flex items-center px-6 py-3 rounded-full text-base font-medium mb-8 ${darkMode
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}
                        >
                            <Rocket className="h-5 w-5 mr-2" />
                            Start Your Journey Today
                        </motion.div>

                        <h2 className={`text-4xl md:text-6xl font-bold mb-8 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Ready to Transform
                            <span className={`block bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-indigo-400' : 'from-emerald-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                Your Career?
                            </span>
                        </h2>

                        <motion.p
                            className={`text-xl md:text-2xl ${darkMode ? 'text-emerald-100' : 'text-gray-600'} mb-12 max-w-3xl mx-auto leading-relaxed`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Join thousands of professionals who have already improved their resumes with our AI-powered platform.
                            Your next opportunity is just one optimized resume away.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.button
                                className={`bg-gradient-to-r ${darkMode ? 'from-emerald-500 to-indigo-600' : 'from-emerald-600 to-indigo-600'} text-white px-12 py-5 rounded-2xl font-semibold text-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group min-w-[250px]`}
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>
                                    <Link href="/">
                                        Get Started Free
                                    </Link>
                                </span>
                                <Rocket className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                            <motion.button
                                className={`px-12 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 min-w-[250px] ${darkMode
                                    ? 'bg-gray-800/50 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400/50'
                                    : 'bg-white/80 text-gray-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                                    } backdrop-blur-sm`}
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/pricing">
                                    View Pricing
                                </Link>
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className={`mt-12 text-sm ${darkMode ? 'text-emerald-300' : 'text-gray-500'}`}
                        >
                            ✨ No credit card required • Free trial • 30-second optimization
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer darkMode={darkMode} />
        </div>
    );
}
