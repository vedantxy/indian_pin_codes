import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, Map, CornerDownRight, Bookmark, Filter, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const DistrictGroup = ({ district, cities, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="stat-card"
            style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden', border: isExpanded ? '1px solid var(--primary-light)' : '1px solid var(--border)', cursor: 'default' }}
        >
            <div 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: isExpanded ? 'var(--bg-secondary)' : '#fff' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: isExpanded ? 'var(--primary-light)' : 'var(--bg-secondary)', padding: '8px', borderRadius: '10px' }}>
                        <Map size={18} color={isExpanded ? 'var(--primary)' : 'var(--text-secondary)'} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{district}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>• {cities.length} Offices</span>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={18} color="var(--text-placeholder)" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                    >
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', borderTop: '1px solid var(--divider)' }}>
                            {cities.map((city, j) => (
                                <div 
                                    key={j} 
                                    style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                                >
                                    <CornerDownRight size={12} color="var(--text-placeholder)" />
                                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{city}</span>
                                </div>
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

    const handleBrowse = () => {
        if (selectedState) {
            onBrowse(selectedState);
        } else {
            toast.error('Select a State');
        }
    };

    return (
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--secondary-light)', padding: '6px 14px', borderRadius: '10px', color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
                    <Layers size={14} fill="currentColor" /> REGIONAL CLUSTERS
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-1px' }}>State Directory</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                    Access high-level administrative groupings and drill down into specific district network densities.
                </p>

                <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', gap: '8px', background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <select 
                            className="floating-input"
                            style={{ paddingTop: '1.1rem', appearance: 'none', border: 'none', background: 'var(--bg-secondary)' }}
                            value={selectedState} 
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="" disabled>Select an Indian State...</option>
                            {states.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <ChevronDown size={18} color="var(--text-placeholder)" />
                        </div>
                    </div>
                    <button 
                        className="primary-btn"
                        onClick={handleBrowse} 
                        disabled={loading}
                        style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px', justifyContent: 'center' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Layers size={18} /> Browse Directory</>}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && Object.keys(results).length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="results-container"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Network Density: <span style={{ color: 'var(--primary)' }}>{selectedState}</span></h3>
                            <button style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <Filter size={14} /> Filter Results
                            </button>
                        </div>
                        
                        {Object.entries(results).map(([district, cities], i) => (
                            <DistrictGroup key={i} district={district} cities={cities} index={i} />
                        ))}
                    </motion.div>
                ) : (
                    results && !loading && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-placeholder)' }}>
                            <Info size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>Select a state to view the administrative directory.</p>
                        </div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ marginTop: '2rem' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="stat-card shimmer" style={{ height: '70px', marginBottom: '1rem' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default StateDirectory;
