import { motion } from 'framer-motion';

interface FooterProps {
    darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
    return (
        <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-900'} text-white mt-20`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-gray-400 mb-4">
                        © 2025 AI Resume Builder. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Contact
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
