import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, Map, CornerDownRight, Bookmark, Filter, Info, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const DistrictGroup = ({ district, cities, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="stat-card glass-card"
            style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden', border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'default', background: 'rgba(255,255,255,0.5)' }}
        >
            <div 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', background: isExpanded ? 'rgba(255,255,255,0.6)' : 'transparent', transition: 'all 0.3s' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ background: isExpanded ? 'var(--primary)' : 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '12px', color: isExpanded ? '#fff' : 'var(--text-secondary)', boxShadow: isExpanded ? 'var(--shadow-creative)' : 'none', transition: 'all 0.3s' }}>
                        <Map size={18} strokeWidth={isExpanded ? 3 : 2} />
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{district}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, opacity: 0.7 }}>{cities.length} DISTRICT UNITS</span>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={20} color={isExpanded ? 'var(--primary)' : 'var(--text-placeholder)'} strokeWidth={3} />
                </motion.div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', borderTop: '1px solid var(--divider)', background: 'rgba(255,255,255,0.3)' }}>
                            {cities.map((city, j) => (
                                <div 
                                    key={j} 
                                    style={{ padding: '1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
                                >
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6 }} />
                                    <span>{city}</span>
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

    const handleExport = () => {
        if (selectedState) {
            window.location.href = `/api/export?state=${encodeURIComponent(selectedState)}`;
            toast.success(`Exporting ${selectedState} data...`);
        } else {
            toast.error('Select a State to export');
        }
    };

    return (
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <Layers size={14} strokeWidth={3} /> ADMINISTRATIVE STACKS
                </div>
                <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Regional <span style={{ color: 'var(--secondary)', fontWeight: 300 }}>Archives</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                    Navigate the vast hierarchical topography of the Indian postal service grouped by state jurisdiction.
                </p>

                <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.4)', padding: '12px', borderRadius: '24px', border: '1px solid var(--border)', alignItems: 'center', boxShadow: 'var(--shadow-glass)' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <select 
                            className="floating-input"
                            style={{ paddingTop: '1.1rem', appearance: 'none', border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}
                            value={selectedState} 
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="" disabled>Select an Indian State...</option>
                            {states.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-30%)', pointerEvents: 'none' }}>
                            <ChevronDown size={18} color="var(--primary)" strokeWidth={3} />
                        </div>
                    </div>
                    <button 
                        className="primary-btn"
                        onClick={handleBrowse} 
                        disabled={loading}
                        style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px', justifyContent: 'center', height: '56px', borderRadius: '18px', fontSize: '1rem', fontWeight: 800, boxShadow: 'var(--shadow-creative)', color: '#fff' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Layers size={18} strokeWidth={2.5} /> EXPLORE</>}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Topographic Units: <span style={{ color: 'var(--secondary)' }}>{selectedState}</span></h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={handleExport}
                                    style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}
                                >
                                    <Download size={16} strokeWidth={2.5} /> Download CSV
                                </button>
                                <button style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                    <Filter size={16} strokeWidth={2.5} /> Filter Regions
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(results).map(([district, cities], i) => (
                                <DistrictGroup key={i} district={district} cities={cities} index={i} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    results && !loading && (
                        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-placeholder)' }}>
                            <div style={{ background: 'rgba(255,255,255,0.4)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)' }}>
                                <Info size={40} style={{ opacity: 0.3 }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Awaiting command</h3>
                            <p style={{ fontWeight: 500 }}>Select a primary jurisdiction to launch directory indexing.</p>
                        </div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ marginTop: '2rem' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="stat-card glass-card shimmer" style={{ height: '76px', marginBottom: '1rem', borderRadius: '18px' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default StateDirectory;
