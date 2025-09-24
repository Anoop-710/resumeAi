import { motion } from 'framer-motion';

interface FooterProps {
    darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
    return (
        <footer className={`${darkMode ? 'bg-emerald-950' : 'bg-gray-900'} text-white mt-20 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className={`${darkMode ? 'text-emerald-300' : 'text-gray-400'} mb-4 text-lg`}>
                        © 2025 AI Resume Builder. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-8">
                        <a href="#" className={`${darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-gray-400 hover:text-white'} transition-colors duration-300 font-medium`}>
                            Privacy Policy
                        </a>
                        <a href="#" className={`${darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-gray-400 hover:text-white'} transition-colors duration-300 font-medium`}>
                            Terms of Service
                        </a>
                        <a href="#" className={`${darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-gray-400 hover:text-white'} transition-colors duration-300 font-medium`}>
                            Contact
                        </a>
                        <a href="#" className={`${darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-gray-400 hover:text-white'} transition-colors duration-300 font-medium`}>
                            Support
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
