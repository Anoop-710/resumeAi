'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function PricingPage() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isAnnual, setIsAnnual] = useState(false);

    const pricingPlans = [
        {
            name: 'Free',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for trying out our AI resume builder',
            features: [
                '3 resume optimizations per month',
                'Basic AI suggestions',
                'PDF export',
                'Email support',
                'Standard templates'
            ],
            limitations: [
                'Limited AI optimizations',
                'Basic templates only',
                'No priority support'
            ],
            popular: false,
            buttonText: 'Coming Soon',
            buttonColor: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
        },
        {
            name: 'Professional',
            price: { monthly: 19, annual: 190 },
            description: 'Ideal for job seekers who want to stand out',
            features: [
                'Unlimited resume optimizations',
                'Advanced AI suggestions',
                'Job description matching',
                'ATS optimization',
                'Premium templates',
                'Priority email support',
                'Multiple format exports',
                'Resume analytics'
            ],
            limitations: [],
            popular: true,
            buttonText: 'Coming Soon',
            buttonColor: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
        },
        {
            name: 'Enterprise',
            price: { monthly: 49, annual: 490 },
            description: 'For teams and businesses with advanced needs',
            features: [
                'Everything in Professional',
                'Team collaboration',
                'Bulk resume processing',
                'Custom templates',
                'API access',
                'Advanced analytics',
                'Advanced integrations',
                'Custom integrations'
            ],
            limitations: [],
            popular: false,
            buttonText: 'Coming Soon',
            buttonColor: 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
        }
    ];

    const faqs = [
        {
            question: 'Can I change my plan anytime?',
            answer: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.'
        },
        {
            question: 'Is there a free trial?',
            answer: 'Yes! We offer a 14-day free trial for our Professional plan. No credit card required to get started.'
        },
        {
            question: 'What if I need more features?',
            answer: 'Our Enterprise plan includes all features, but if you need something custom, our team can work with you to create a tailored solution.'
        },
        {
            question: 'Do you offer refunds?',
            answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll refund your payment.'
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-emerald-950 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-emerald-100'}`}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
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
                            Simple, Transparent Pricing
                        </motion.div>

                        <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight`}>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'} block`}>
                                Choose Your
                            </span>
                            <span className={`block bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-indigo-400' : 'from-emerald-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                Perfect Plan
                            </span>
                        </h1>

                        <motion.p
                            className={`text-xl md:text-2xl ${darkMode ? 'text-emerald-100' : 'text-gray-600'} mb-12 max-w-3xl mx-auto leading-relaxed`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Transform your career with AI-powered resume optimization.
                            Choose the plan that fits your needs and start creating resumes that get noticed.
                        </motion.p>

                        {/* Billing Toggle */}
                        <motion.div
                            className="flex items-center justify-center space-x-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <span className={`${darkMode ? 'text-emerald-200' : 'text-gray-700'} font-medium text-lg`}>
                                Monthly
                            </span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isAnnual
                                    ? (darkMode ? 'bg-emerald-500' : 'bg-emerald-600')
                                    : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={`${darkMode ? 'text-emerald-200' : 'text-gray-700'} font-medium text-lg`}>
                                Annual
                            </span>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}>
                                Save 20%
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative rounded-2xl shadow-xl border transition-all duration-300 hover:shadow-2xl backdrop-blur-sm ${plan.popular
                                    ? (darkMode ? 'border-emerald-500 scale-105 bg-gray-800/50' : 'border-emerald-300 scale-105 bg-white/80')
                                    : darkMode
                                        ? 'border-gray-700 bg-gray-800/50'
                                        : 'border-gray-200 bg-white/80'
                                    } p-8`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className={`text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 ${darkMode
                                            ? 'bg-gradient-to-r from-emerald-500 to-indigo-600'
                                            : 'bg-gradient-to-r from-emerald-600 to-indigo-600'
                                            }`}>
                                            <Star className="h-4 w-4" />
                                            <span>Most Popular</span>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                                        {plan.description}
                                    </p>
                                    <div className="mb-6">
                                        <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                                        </span>
                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            /{isAnnual ? 'year' : 'month'}
                                        </span>
                                        {isAnnual && plan.price.monthly > 0 && (
                                            <p className="text-sm text-green-600 mt-1">
                                                ${(plan.price.annual / 12).toFixed(0)}/month billed annually
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start space-x-3">
                                            <Check className={`h-5 w-5 text-green-500 mt-0.5 flex-shrink-0`} />
                                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.limitations.map((limitation, limitationIndex) => (
                                        <li key={limitationIndex} className="flex items-start space-x-3 opacity-60">
                                            <div className="h-5 w-5 rounded-full bg-gray-300 mt-0.5 flex-shrink-0" />
                                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>
                                                {limitation}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group ${plan.popular
                                        ? (darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white')
                                        : `bg-gradient-to-r ${plan.buttonColor} text-white`
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{plan.buttonText}</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Why Choose Our AI Resume Builder?
                        </h2>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Compare features across all plans to find the perfect fit for your needs.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                description: 'Get optimized resumes in seconds with our advanced AI technology.'
                            },
                            {
                                icon: Shield,
                                title: 'ATS Optimized',
                                description: 'Ensure your resume passes through Applicant Tracking Systems.'
                            },
                            {
                                icon: Users,
                                title: 'Team Collaboration',
                                description: 'Work together with your team on resume optimization projects.'
                            },
                            {
                                icon: Star,
                                title: 'Premium Support',
                                description: 'Get help from our expert team whenever you need it.'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                            >
                                <div className={`p-3 rounded-lg w-fit mx-auto mb-4 ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-indigo-600'
                                    }`}>
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {feature.title}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Frequently Asked Questions
                        </h2>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Everything you need to know about our pricing and features.
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}
                            >
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {faq.question}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {faq.answer}
                                </p>
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
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <motion.button
                                className={`text-white px-12 py-5 rounded-2xl font-semibold text-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group min-w-[250px] ${darkMode ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700' : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700'
                                    }`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Start Free Trial</span>
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                            <motion.button
                                className={`px-12 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 min-w-[250px] ${darkMode
                                    ? 'bg-gray-800/50 text-emerald-300 border-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400/50'
                                    : 'bg-white/80 text-gray-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                                    } backdrop-blur-sm`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact Sales
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer darkMode={darkMode} />
        </div>
    );
}
