import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { BiMapAlt } from 'react-icons/bi';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-500">
                <BiMapAlt size={20} />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-400">
                India Pincode
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-sm">
              A modern, fast, and premium MERN stack application to search, explore, and analyze India Post PIN code data with beautiful analytics and visualizations.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/vedantxy" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="https://x.com/VedantPate1601" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/vedant-patel-3b6a4636a/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              API & Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/api/docs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">REST API Docs</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Data Source</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Status</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} India Pincode. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
