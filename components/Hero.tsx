import { motion } from 'framer-motion';

interface HeroProps {
    darkMode: boolean;
}

export default function Hero({ darkMode }: HeroProps) {
    return (
        <motion.div
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                🚀 Powered by Advanced AI
            </motion.div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight`}>
                <span className={`${darkMode ? 'text-white' : 'text-gray-900'} block`}>
                    Build Your Perfect
                </span>
                <span className={`block bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-emerald-400 to-indigo-400' : 'bg-gradient-to-r from-emerald-600 to-indigo-600'}`}>
                    AI-Powered Resume
                </span>
            </h1>

            <motion.p
                className={`text-xl md:text-2xl ${darkMode ? 'text-emerald-100' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                Transform your career with our intelligent resume optimization platform.
                Whether you're starting from scratch or perfecting your existing resume,
                our AI creates resumes that get noticed by recruiters and pass ATS systems.
            </motion.p>
        </motion.div>
    );
}
