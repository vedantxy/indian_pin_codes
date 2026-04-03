import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Copy, ExternalLink, Info, Check, X, Building, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';

const PincodeSearch = ({ onSearch, results, loading }) => {
    const [pincode, setPincode] = useState('');
    const [touched, setTouched] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const isValid = /^\d{6}$/.test(pincode);

    const handleSearch = () => {
        setTouched(true);
        if (isValid) {
            onSearch(pincode);
        } else {
            toast.error('Invalid Pincode Format');
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success(`Copied: ${text}`);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 14px', borderRadius: '10px', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
                    <Navigation size={14} fill="currentColor" /> POSTAL RADIUS SCAN
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-1px' }}>Find Your District</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                    Quickly retrieve authenticated postal data including office classification and district boundaries.
                </p>

                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px', background: '#fff', padding: '10px', borderRadius: '20px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', alignItems: 'center' }}>
                    <div className="floating-input-group">
                        <input 
                            type="text" 
                            placeholder=" "
                            maxLength={6}
                            className="floating-input"
                            value={pincode}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 6) setPincode(val);
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <label className="floating-label">Enter 6-digit Pincode</label>
                    </div>
                    <button 
                        className="primary-btn"
                        onClick={handleSearch} 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px', justifyContent: 'center', height: '52px', borderRadius: '14px' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Search size={20} strokeWidth={2.5} /> Search</>}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && results.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
                    >
                        {results.map((item, index) => (
                            <motion.div 
                                key={index} 
                                variants={cardVariants}
                                className="stat-card"
                                style={{ background: '#fff', cursor: 'default' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '12px' }}>
                                        <Building size={20} color="var(--primary)" />
                                    </div>
                                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700 }}>
                                        {item.officeType || 'POST OFFICE'}
                                    </div>
                                </div>

                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{item.officeName}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    <MapPin size={14} color="var(--text-placeholder)" />
                                    <span>{item.districtName}, <strong>{item.stateName}</strong></span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
                                    <button 
                                        onClick={() => copyToClipboard(item.pincode, index)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                    >
                                        {copiedIndex === index ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                                        {item.pincode}
                                    </button>
                                    <button style={{ padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <ExternalLink size={14} color="var(--text-secondary)" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    results && !loading && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-placeholder)' }}>
                            <Info size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>No results found for this selection.</p>
                        </div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="stat-card shimmer" style={{ height: '220px' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PincodeSearch;
