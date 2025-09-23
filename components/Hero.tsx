import { motion } from 'framer-motion';

interface HeroProps {
    darkMode: boolean;
}

export default function Hero({ darkMode }: HeroProps) {
    return (
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Build Your Perfect
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI-Powered Resume
                </span>
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                Transform your career with our intelligent resume optimization platform.
                Whether you&apos;re starting from scratch or perfecting your existing resume.
            </p>
        </motion.div>
    );
}
