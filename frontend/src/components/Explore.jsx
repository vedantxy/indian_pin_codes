import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Filter, Database, Hash, MapPin, Building2, Globe } from 'lucide-react';
import { toast } from 'react-toastify';

const Explore = ({ states }) => {
    const [selectedState, setSelectedState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [taluks, setTaluks] = useState([]);
    const [selectedTaluk, setSelectedTaluk] = useState('');
    
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTaluks, setLoadingTaluks] = useState(false);

    // Fetch districts when state changes
    useEffect(() => {
        if (selectedState) {
            fetchDistricts(selectedState);
            setSelectedDistrict('');
            setTaluks([]);
            setSelectedTaluk('');
        }
    }, [selectedState]);

    // Fetch taluks when district changes
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
            if (res.ok) setDistricts(data);
            else setDistricts([]);
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
            if (res.ok) setTaluks(data);
            else setTaluks([]);
        } catch (err) {
            console.error(err);
            toast.error('Network error fetching taluks');
        } finally {
            setLoadingTaluks(false);
        }
    };

    const handleSearch = async (pageNum = 1) => {
        setLoading(true);
        setPage(pageNum);
        try {
            let url = `/api/pincodes?page=${pageNum}&limit=${limit}`;
            if (selectedState) url += `&state=${encodeURIComponent(selectedState)}`;
            if (selectedDistrict) url += `&district=${encodeURIComponent(selectedDistrict)}`;
            if (selectedTaluk) url += `&taluk=${encodeURIComponent(selectedTaluk)}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setResults(data.data);
                setTotal(data.total);
                if (data.data.length === 0) toast.info('No records found for these filters');
            } else {
                toast.error(data.message || 'Search failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during exploration');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', border: '1px solid var(--border)' }}>
                    <Database size={14} strokeWidth={3} /> PIN EXPLORER
                </div>
                <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Explore <span style={{ color: 'var(--primary)', fontWeight: 300 }}>Records</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                    Access the complete master database of Indian postal records with advanced jurisdictional filtering.
                </p>
            </motion.div>

            {/* Filter Section */}
            <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto 3rem', padding: '1.5rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '8px', textTransform: 'uppercase' }}>State</label>
                        <select 
                            className="floating-input" 
                            style={{ padding: '0.75rem', height: '48px', appearance: 'none' }}
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="">All States</option>
                            {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '8px', textTransform: 'uppercase' }}>District</label>
                        <select 
                            className="floating-input" 
                            style={{ padding: '0.75rem', height: '48px', appearance: 'none' }}
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                        >
                            <option value="">All Districts</option>
                            {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '8px', textTransform: 'uppercase' }}>Taluk</label>
                        <select 
                            className="floating-input" 
                            style={{ padding: '0.75rem', height: '48px', appearance: 'none' }}
                            value={selectedTaluk}
                            onChange={(e) => setSelectedTaluk(e.target.value)}
                            disabled={!selectedDistrict}
                        >
                            <option value="">All Taluks</option>
                            {taluks.map((t, i) => <option key={i} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <button 
                        className="primary-btn" 
                        style={{ height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        onClick={() => handleSearch(1)}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff' }} /> : <Search size={18} />}
                        SEARCH RECORDS
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {results.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid var(--border)' }}>
                                    <tr>
                                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase' }}>Office Name</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase' }}>Pincode</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase' }}>District</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase' }}>State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="row-hover">
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Building2 size={16} color="var(--primary)" />
                                                    {item.officeName}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 400, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>
                                                {item.pincode}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.districtName}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.stateName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                            <button 
                                className="glass-card" 
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.5 }}
                                onClick={() => page > 1 && handleSearch(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={18} /> PREV
                            </button>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '10px' }}>
                                PAGE {page} OF {totalPages || 1}
                            </div>
                            <button 
                                className="glass-card" 
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.5 }}
                                onClick={() => page < totalPages && handleSearch(page + 1)}
                                disabled={page >= totalPages}
                            >
                                NEXT <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    !loading && (
                        <div style={{ textAlign: 'center', marginTop: '5rem', opacity: 0.3 }}>
                            <Filter size={48} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 600 }}>Select filters and click search to explore records.</p>
                        </div>
                    )
                )}
            </AnimatePresence>
        </section>
    );
};

export default Explore;
