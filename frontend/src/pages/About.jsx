import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiMail, FiCode, FiDatabase, FiLayout } from 'react-icons/fi';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6">About the Project</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A high-performance, open-source platform designed to make India's vast postal network accessible, searchable, and beautifully visual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-panel p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl mb-4">
            <FiLayout size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">Modern UI</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Built with React, Tailwind CSS v4, and Framer Motion for a premium, buttery-smooth experience.</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center rounded-xl mb-4">
            <FiDatabase size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">Robust Backend</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Powered by Node.js, Express, and MongoDB with advanced indexing for lightning-fast queries.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-xl mb-4">
            <FiCode size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">Open API</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Exposes a clean REST API allowing developers to integrate pincode data into their own applications.</p>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 rounded-3xl mb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-4">Data Source</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          The data provided in this application is sourced from the official directory of the Department of Posts, Ministry of Communications, Government of India. It has been formatted and indexed to provide a more developer-friendly and user-friendly experience.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          While we strive to keep the data updated, it is always recommended to verify with official India Post resources for critical applications.
        </p>
      </div>

      <div className="flex justify-center gap-6">
        <a href="https://github.com/vedantxy" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
          <FiGithub size={20} /> View on GitHub
        </a>
        <a href="mailto:hello@example.com" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20">
          <FiMail size={20} /> Contact Us
        </a>
      </div>
    </motion.div>
  );
};

export default About;
