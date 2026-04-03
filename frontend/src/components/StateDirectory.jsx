import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, ChevronDown, Building, Search, ArrowRight, Bookmark, SortAsc } from 'lucide-react';
import { toast } from 'react-toastify';

const DistrictGroup = ({ district, cities, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="content-card glass glass-hover"
            style={{ marginBottom: '1.25rem', overflow: 'hidden' }}
        >
            <div 
                className="card-header" 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '6px', borderRadius: '8px' }}>
                        <Map size={18} color="#8B5CF6" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#F1F5F9' }}>{district}</span>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600 }}>{cities.length} Offices</span>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={20} color="#94A3B8" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="results-grid" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.2)' }}>
                            {cities.map((city, j) => (
                                <motion.div 
                                    key={j} 
                                    whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.05)' }}
                                    style={{ padding: '0.85rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <CornerDownRight size={14} color="#3B82F6" />
                                    <strong style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>{city}</strong>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const StateDirectory = ({ states, onBrowse, results, loading }) => {
    const [selectedState, setSelectedState] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStates = states.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleBrowse = () => {
        if (selectedState) {
            onBrowse(selectedState);
        } else {
            toast.error('Please select a state to view the network');
        }
    };

    return (
        <section className="view-container">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-hero"
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', padding: '6px 12px', borderRadius: '12px', color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    <Layers size={14} /> EXPLORE BY ADMINISTRATIVE ZONE
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#F1F5F9' }}>State Directory</h2>
                <p style={{ color: '#94A3B8', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                    Browse through thousands of post offices grouped by districts within their respective administrative states.
                </p>

                <div className="search-input-group glass" style={{ maxWidth: '650px', padding: '10px', gap: '10px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <select 
                            className="floating-input"
                            style={{ paddingTop: '1rem', appearance: 'none' }}
                            value={selectedState} 
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="" disabled>Choose an Indian State...</option>
                            {states.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <ChevronDown size={18} color="#94A3B8" />
                        </div>
                    </div>
                    <button 
                        onClick={handleBrowse} 
                        disabled={loading}
                        style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', justifyContent: 'center' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Layers size={18} /> View Network</>}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && Object.keys(results).length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="results-container"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Postal Infrastructure: <span style={{ color: '#3B82F6' }}>{selectedState}</span></h3>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="icon-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <SortAsc size={14} /> Sort A-Z
                                </button>
                                <button className="icon-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Bookmark size={14} /> Save State
                                </button>
                            </div>
                        </div>
                        
                        {Object.entries(results).map(([district, cities], i) => (
                            <DistrictGroup key={i} district={district} cities={cities} index={i} />
                        ))}
                    </motion.div>
                ) : (
                    results && !loading && (
                        <div className="empty-state">No directory data found for {selectedState}</div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ marginTop: '2rem' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="content-card glass shimmer" style={{ height: '70px', marginBottom: '1.25rem' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

// Internal component for grid indentation
const CornerDownRight = ({ size, color }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
    >
        <polyline points="15 10 20 15 15 20" />
        <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
);

export default StateDirectory;
