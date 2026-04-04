import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Layers, Search, Info, Globe, Navigation, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const LocationPicker = ({ states }) => {
    const [selectedState, setSelectedState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [taluks, setTaluks] = useState([]);
    const [selectedTaluk, setSelectedTaluk] = useState('');
    
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTaluks, setLoadingTaluks] = useState(false);

    // Reset when state changes
    useEffect(() => {
        if (selectedState) {
            fetchDistricts(selectedState);
            setSelectedDistrict('');
            setTaluks([]);
            setSelectedTaluk('');
        }
    }, [selectedState]);

    // Reset when district changes
    useEffect(() => {
        if (selectedDistrict) {
            fetchTaluks(selectedState, selectedDistrict);
            setSelectedTaluk('');
        }
    }, [selectedDistrict]);

    const fetchDistricts = async (stateName) => {
        setLoadingDistricts(true);
        try {
            const res = await fetch(`/api/states/${encodeURIComponent(stateName)}/districts`);
            const data = await res.json();
            if (res.ok) {
                setDistricts(data);
            } else {
                setDistricts([]);
                toast.error(data.message || 'Failed to fetch districts');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error fetching districts');
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchTaluks = async (stateName, districtName) => {
        setLoadingTaluks(true);
        try {
            const res = await fetch(`/api/states/${encodeURIComponent(stateName)}/districts/${encodeURIComponent(districtName)}/taluks`);
            const data = await res.json();
            if (res.ok) {
                setTaluks(data);
            } else {
                setTaluks([]);
                toast.error(data.message || 'Failed to fetch taluks');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error fetching taluks');
        } finally {
            setLoadingTaluks(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <Globe size={14} strokeWidth={3} /> HIERARCHICAL INDEX
                </div>
                <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Location <span style={{ color: 'var(--primary)', fontWeight: 300 }}>Navigator</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                    Drill down through the administrative layers of the postal network using granular geographic filtering.
                </p>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="glass-card" 
                    style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.4)' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {/* State Selection */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '4px' }}>
                                01. Primary State
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    className="floating-input"
                                    style={{ paddingTop: '1.1rem', appearance: 'none', background: 'rgba(255,255,255,0.6)', fontWeight: 700 }}
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                >
                                    <option value="" disabled>Select State...</option>
                                    {states.map((s, i) => (
                                        <option key={i} value={s}>{s}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-20%)', pointerEvents: 'none' }}>
                                    <ChevronDown size={18} color="var(--primary)" strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* District Selection */}
                        <motion.div 
                            animate={{ opacity: selectedState ? 1 : 0.5, pointerEvents: selectedState ? 'auto' : 'none' }}
                            style={{ position: 'relative' }}
                        >
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: selectedState ? 'var(--text-placeholder)' : 'var(--divider)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '4px' }}>
                                02. District Bureau
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    className="floating-input"
                                    style={{ paddingTop: '1.1rem', appearance: 'none', background: 'rgba(255,255,255,0.6)', fontWeight: 700 }}
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!selectedState || loadingDistricts}
                                >
                                    <option value="" disabled>{loadingDistricts ? 'Loading...' : 'Select District...'}</option>
                                    {districts.map((d, i) => (
                                        <option key={i} value={d}>{d}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-20%)', pointerEvents: 'none' }}>
                                    {loadingDistricts ? <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: 'var(--primary)' }} /> : <ChevronDown size={18} color="var(--primary)" strokeWidth={3} />}
                                </div>
                            </div>
                        </motion.div>

                        {/* Taluk Selection */}
                        <motion.div 
                            animate={{ opacity: selectedDistrict ? 1 : 0.5, pointerEvents: selectedDistrict ? 'auto' : 'none' }}
                            style={{ position: 'relative' }}
                        >
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: selectedDistrict ? 'var(--text-placeholder)' : 'var(--divider)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '4px' }}>
                                03. Taluk / City
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    className="floating-input"
                                    style={{ paddingTop: '1.1rem', appearance: 'none', background: 'rgba(255,255,255,0.6)', fontWeight: 700 }}
                                    value={selectedTaluk}
                                    onChange={(e) => setSelectedTaluk(e.target.value)}
                                    disabled={!selectedDistrict || loadingTaluks}
                                >
                                    <option value="" disabled>{loadingTaluks ? 'Searching...' : 'Select Taluk...'}</option>
                                    {taluks.map((t, i) => (
                                        <option key={i} value={t}>{t}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-20%)', pointerEvents: 'none' }}>
                                    {loadingTaluks ? <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: 'var(--primary)' }} /> : <ChevronDown size={18} color="var(--primary)" strokeWidth={3} />}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {selectedTaluk && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{ maxWidth: '600px', margin: '3rem auto', padding: '2.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.6)' }}
                    >
                        <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#fff', boxShadow: 'var(--shadow-creative)' }}>
                            <Navigation size={28} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{selectedTaluk}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Layers size={14} /> {selectedDistrict}, <span style={{ color: 'var(--primary)' }}>{selectedState}</span>
                        </p>
                        
                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.4)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', marginBottom: '4px' }}>Administrative Class</p>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tier 1 Office</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.4)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', marginBottom: '4px' }}>Network Status</p>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success)' }}>Active</p>
                            </div>
                        </div>
                        
                        <button className="primary-btn" style={{ marginTop: '2rem', width: '100%', borderRadius: '14px' }}>
                            VIEW DETAILED ANALYTICS
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!selectedState && !loadingDistricts && (
                <div style={{ textAlign: 'center', marginTop: '5rem', opacity: 0.3 }}>
                    <Building size={48} style={{ marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600 }}>Awaiting jurisdiction selection...</p>
                </div>
            )}
        </section>
    );
};

export default LocationPicker;
