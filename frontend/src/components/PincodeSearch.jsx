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
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <Navigation size={14} strokeWidth={3} /> GEOSPATIAL ENGINE
                </div>
                <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Postal Network <span style={{ color: 'var(--primary)', fontWeight: 300 }}>Scanner</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                    Access high-fidelity postal data across 28 states and 8 Union Territories with verified district indexing.
                </p>

                <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.4)', padding: '12px', borderRadius: '24px', border: '1px solid var(--border)', alignItems: 'center', boxShadow: 'var(--shadow-glass)' }}>
                    <div className="floating-input-group" style={{ flex: 1 }}>
                        <input 
                            type="text" 
                            placeholder=" "
                            maxLength={6}
                            className="floating-input"
                            value={pincode}
                            style={{ background: 'transparent', fontSize: '1.1rem', fontWeight: 600 }}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 6) setPincode(val);
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <label className="floating-label" style={{ fontWeight: 600 }}>Enter 6-digit Pincode</label>
                    </div>
                    <button 
                        className="primary-btn"
                        onClick={handleSearch} 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px', justifyContent: 'center', height: '56px', borderRadius: '18px', fontSize: '1rem', fontWeight: 800, boxShadow: 'var(--shadow-creative)' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Search size={20} strokeWidth={3} /> SCAN</>}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && results.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}
                    >
                        {results.map((item, index) => (
                            <motion.div 
                                key={index} 
                                variants={cardVariants}
                                className="stat-card glass-card"
                                style={{ background: 'rgba(255,255,255,0.5)', cursor: 'default', padding: '1.75rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '14px', color: '#fff', boxShadow: 'var(--shadow-creative)' }}>
                                        <Building size={22} strokeWidth={2.5} />
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.6)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid var(--border)', letterSpacing: '0.5px' }}>
                                        {item.officeType || 'POST OFFICE'}
                                    </div>
                                </div>

                                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{item.office}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 500 }}>
                                    <MapPin size={16} color="var(--primary)" strokeWidth={2.5} />
                                    <span>{item.district}, <strong style={{ color: 'var(--text-primary)' }}>{item.state}</strong></span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--divider)', paddingTop: '1.25rem' }}>
                                    <button 
                                        onClick={() => copyToClipboard(item.pincode, index)}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)' }}
                                    >
                                        {copiedIndex === index ? <Check size={16} color="#10B981" strokeWidth={3} /> : <Copy size={16} strokeWidth={2} />}
                                        PIN: {item.pincode}
                                    </button>
                                    <button style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <ExternalLink size={16} color="var(--primary)" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    results && !loading && (
                        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-placeholder)' }}>
                            <div style={{ background: 'rgba(255,255,255,0.4)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)' }}>
                                <Info size={40} style={{ opacity: 0.3 }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No data found</h3>
                            <p style={{ fontWeight: 500 }}>Try another postal code or check your entry.</p>
                        </div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="stat-card glass-card shimmer" style={{ height: '240px', borderRadius: '24px' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PincodeSearch;
