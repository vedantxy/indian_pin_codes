import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDownload, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const Explore = () => {
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch list of states for the filter
    const fetchStates = async () => {
      try {
        const res = await axios.get('/api/states');
        setStates(res.data);
      } catch (err) {
        console.error('Failed to load states', err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const stateParam = params.get('state');
    
    if (stateParam && stateParam !== selectedState) {
      setSelectedState(stateParam);
    }

    if (q) {
      setSearchQuery(q);
      fetchSearchData(q);
    } else {
      fetchData(1, stateParam || '');
    }
  }, [location.search]);

  const fetchData = async (page, stateFilter = selectedState) => {
    setLoading(true);
    try {
      let url = `/api/pincodes?page=${page}&limit=20`;
      if (stateFilter) {
        url += `&state=${encodeURIComponent(stateFilter)}`;
      }
      const res = await axios.get(url);
      setResults(res.data.data);
      setPagination({ page: res.data.page, limit: res.data.limit, total: res.data.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchData = async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/search?q=${query}`);
      setResults(res.data);
      setPagination({ page: 1, limit: res.data.length, total: res.data.length });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSearchQuery(''); // Clear search query when filtering by state
    if (newState) {
      navigate(`/explore?state=${encodeURIComponent(newState)}`);
    } else {
      navigate('/explore');
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Explore Directory</h1>
          <p className="text-slate-600 dark:text-slate-400">Search and filter through the complete database.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a 
            href={selectedState ? `/api/export?state=${encodeURIComponent(selectedState)}` : "/api/export"} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-300 dark:border-slate-700"
          >
            <FiDownload /> Export CSV
          </a>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glass-panel p-4 rounded-xl mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
            <FiSearch />
          </button>
          <input
            type="text"
            placeholder="Search by pincode, office, or district..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2">
            <FiFilter className="text-slate-500 mr-2" />
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 appearance-none pr-4 cursor-pointer"
            >
              <option value="">All States</option>
              {states.map((state, idx) => (
                <option key={idx} value={state} className="dark:bg-slate-800">{state}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <FiGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Results View */}
          {viewMode === 'table' ? (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Pincode</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Office Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">District</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">State</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {results.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/pincode/${item.pincode}`} className="font-mono text-blue-600 dark:text-blue-400 hover:underline">
                            {item.pincode}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{item.officeName}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.district}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.state}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                            item.deliveryStatus === 'Delivery' 
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                              : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          }`}>
                            {item.deliveryStatus || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No results found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-xl hover:-translate-y-1 transition-transform relative group">
                  <div className="flex justify-between items-start mb-4">
                    <Link to={`/pincode/${item.pincode}`} className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 group-hover:underline">
                      {item.pincode}
                    </Link>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                      item.deliveryStatus === 'Delivery' 
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                    }`}>
                      {item.deliveryStatus || 'Unknown'}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">{item.officeName}</h4>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="text-slate-500">District:</span> {item.district}</p>
                    <p><span className="text-slate-500">State:</span> {item.state}</p>
                  </div>
                </div>
              ))}
              {results.length === 0 && (
                <div className="col-span-3 text-center py-8 text-slate-500">No results found</div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total.toLocaleString()} results
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fetchData(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 disabled:opacity-50"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20">
                  {pagination.page}
                </button>
                {pagination.page < totalPages && (
                  <button 
                    onClick={() => fetchData(pagination.page + 1)}
                    className="w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                  >
                    {pagination.page + 1}
                  </button>
                )}
                {pagination.page < totalPages - 1 && <span className="text-slate-400 dark:text-slate-500">...</span>}
                <button 
                  onClick={() => fetchData(Math.min(totalPages, pagination.page + 1))}
                  disabled={pagination.page >= totalPages}
                  className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 disabled:opacity-50"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Explore;
