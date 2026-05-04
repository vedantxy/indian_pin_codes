import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBarChart2, FiDownload, FiArrowRight } from 'react-icons/fi';
import { BiBuildingHouse } from 'react-icons/bi';
import axios from 'axios';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalPincodes: '19,300+', totalStates: 36, deliveryOffices: '155,000+' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats({
          totalPincodes: response.data.totalPincodes.toLocaleString() + '+',
          totalStates: response.data.totalStates,
          deliveryOffices: ((response.data.deliveryOffices || 0) + (response.data.nonDeliveryOffices || 0)).toLocaleString() + '+'
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 6 && !isNaN(searchQuery.trim())) {
      navigate(`/pincode/${searchQuery.trim()}`);
    } else {
      navigate(`/explore?q=${searchQuery.trim()}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="relative w-full overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-sky-400/10 dark:bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 mb-8 backdrop-blur-sm text-sm text-slate-700 dark:text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Premium Postal Data Explorer
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
          Explore India's <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 dark:from-blue-400 dark:via-sky-400 dark:to-blue-500">
            Postal Network
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10">
          A lightning-fast, comprehensive database of all Indian PIN codes. Search by state, district, or office name with beautiful analytics and instant exports.
        </motion.p>

        {/* Search Bar */}
        <motion.form variants={itemVariants} onSubmit={handleSearch} className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-all duration-300"></div>
          <div className="relative flex items-center glass-panel rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <div className="pl-6 text-slate-500 dark:text-slate-400">
              <FiSearch size={24} />
            </div>
            <input
              type="text"
              placeholder="Enter Pincode, State, or District..."
              className="w-full py-5 px-4 bg-transparent text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mr-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Search
            </button>
          </div>
        </motion.form>
      </section>

      {/* Quick Stats Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                <FiMapPin size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">Total Pincodes</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">{stats.totalPincodes}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Across {stats.totalStates} States & UTs</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-sky-100 dark:bg-sky-500/10 rounded-xl text-sky-600 dark:text-sky-400">
                <BiBuildingHouse size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">Post Offices</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">{stats.deliveryOffices}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Delivery & Non-Delivery</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                <FiBarChart2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">Data Updates</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">Real-time</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Synchronized with API</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Powerful Features</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to analyze and utilize India's postal data efficiently.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FiSearch size={20} />,
              title: 'Lightning Fast Search',
              desc: 'Find any pincode, district, or office name instantly with our optimized search engine.',
            },
            {
              icon: <FiBarChart2 size={20} />,
              title: 'Interactive Dashboard',
              desc: 'Visualize data distributions with beautiful charts and interactive maps.',
            },
            {
              icon: <FiDownload size={20} />,
              title: 'CSV Export',
              desc: 'Download filtered datasets easily for offline use or integration into other tools.',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <motion.div variants={itemVariants} className="glass-panel p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-sky-100/30 dark:from-blue-600/20 dark:to-sky-500/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Ready to explore?</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Dive into the comprehensive dashboard and start analyzing postal data right away.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/30"
            >
              Open Dashboard
              <FiArrowRight />
            </button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
