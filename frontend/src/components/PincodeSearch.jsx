import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Copy, ExternalLink, Info, Check, X, Building, CornerDownRight } from 'lucide-react';
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
            toast.error('Please enter a valid 6-digit pincode');
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success(`Pincode ${text} copied!`);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section className="view-container">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-hero"
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '12px', color: '#3B82F6', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    <Search size={14} /> EXPLORE THE NETWORK
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#F1F5F9' }}>Pincode Inquisitor</h2>
                <p style={{ color: '#94A3B8', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                    Enter any Indian postal code to retrieve instant details about offices, districts, and administrative states.
                </p>

                <div className="search-input-group glass" style={{ maxWidth: '600px', padding: '10px' }}>
                    <div className="floating-input-group" style={{ flex: 1, marginBottom: 0 }}>
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
                            aria-invalid={touched && !isValid}
                        />
                        <label className="floating-label">Enter 6-digit Pincode</label>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {touched && pincode.length === 6 && (
                                isValid ? <Check size={18} color="#10B981" /> : <X size={18} color="#EF4444" />
                            )}
                            <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>{pincode.length}/6</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleSearch} 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'center' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', marginBottom: 0 }} /> : <><Search size={18} /> Retrieve</>}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {results && results.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="results-container"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}
                    >
                        {results.map((item, index) => (
                            <motion.div 
                                key={index} 
                                variants={cardVariants}
                                whileHover={{ y: -5 }}
                                className="stat-card glass glass-hover"
                                style={{ borderLeft: '4px solid #3B82F6', background: 'rgba(30, 41, 59, 0.4)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px', height: 'fit-content' }}>
                                            <Building size={20} color="#3B82F6" />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F1F5F9' }}>{item.officeName}</h4>
                                            <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{item.pincode}</p>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {item.officeType || 'Office'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                                        <MapPin size={14} /> <span>{item.districtName}, <strong style={{color: '#E2E8F0'}}>{item.stateName}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                                        <Info size={14} /> <span>Status: <span style={{color: '#10B981'}}>Active Registry</span></span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                    <button 
                                        className="icon-btn" 
                                        style={{ flex: 1, background: 'rgba(59, 130, 246, 0.05)', color: '#3B82F6', fontSize: '0.75rem', fontWeight: 600, padding: '8px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                        onClick={() => copyToClipboard(item.pincode, index)}
                                    >
                                        {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />} Copy Pin
                                    </button>
                                    <button 
                                        className="icon-btn" 
                                        style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <ExternalLink size={14} /> Map View
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    results && !loading && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="empty-state">
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1.5rem' }}>
                                <X size={40} color="#EF4444" />
                            </div>
                            <h3>No Results Found</h3>
                            <p>We couldn't find any postal data for pincode <strong>{pincode}</strong>. Please try again with a valid 6-digit code.</p>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
            
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="stat-card glass shimmer" style={{ height: '200px' }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PincodeSearch;
