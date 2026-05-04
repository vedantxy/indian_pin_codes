import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCopy, FiShare2, FiMapPin, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const PincodeDetail = () => {
  const { pincode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      try {
        const res = await axios.get(`/api/search/${pincode}`);
        if (res.data && res.data.length > 0) {
          // Use the first result for the main card, others as "nearby"
          setData(res.data[0]);
          setOffices(res.data);
        } else {
          toast.error('Pincode not found');
          setData(null);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch pincode details');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPincodeDetails();
  }, [pincode]);

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(data.pincode);
      toast.success('Pincode copied to clipboard!');
    }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">No results found</h2>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
      >
        <FiArrowLeft /> Back to Search
      </button>

      <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-400">
                  {data.pincode}
                </h1>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  data.deliveryStatus === 'Delivery' 
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                }`}>
                  {data.deliveryStatus || 'Unknown'}
                </span>
              </div>
              <h2 className="text-2xl text-slate-800 dark:text-slate-200 font-medium">{data.officeName}</h2>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <FiCopy /> Copy
              </button>
              <button 
                onClick={shareLink}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <FiShare2 /> Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <FiMapPin className="text-blue-600 dark:text-blue-400" /> Location Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">State</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{data.state}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">District</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{data.district}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Taluk</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{data.taluk || '-'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <FiInfo className="text-blue-600 dark:text-blue-400" /> Office Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Delivery Status</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{data.deliveryStatus || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>

          {offices.length > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-4">All Offices under this Pincode</h3>
              <div className="flex flex-wrap gap-3">
                {offices.map((office, idx) => (
                  <div key={idx} className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-slate-700 dark:text-slate-200">{office.officeName}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{office.deliveryStatus || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PincodeDetail;
