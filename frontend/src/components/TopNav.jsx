import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Settings, Command, User, Globe, MapPin, Hash, Building, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const TopNav = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    const handleGlobalExport = () => {
        window.location.href = '/api/export';
        toast.info('Initiating global data export...');
    };

    // Debounce search
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
                const data = await res.json();
                if (res.ok) {
                    setSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.header 
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            className="top-nav glass-card"
            style={{ 
                margin: '1rem 1rem 0 1rem',
                borderRadius: 'var(--radius-xl)',
                height: '72px',
                background: 'rgba(255, 255, 255, 0.4)',
                borderBottom: '1px solid var(--border)',
                boxShadow: 'var(--shadow-glass)',
                zIndex: 1000
            }}
        >
            <div ref={searchRef} style={{ position: 'relative', width: '400px' }}>
                <div className="search-bar-global" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                    {loading ? (
                        <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'var(--primary)' }} />
                    ) : (
                        <Search size={18} color="var(--primary)" />
                    )}
                    <input 
                        type="text" 
                        placeholder="Search by pincode, area, or district..." 
                        aria-label="Global search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                        style={{ fontSize: '0.95rem', fontWeight: 500 }}
                    />
                    <div style={{ background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <Command size={10} /> K
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="glass-card"
                            style={{
                                position: 'absolute',
                                top: '120%',
                                left: 0,
                                right: 0,
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '18px',
                                padding: '10px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                border: '1px solid var(--border)',
                                overflow: 'hidden'
                            }}
                        >
                            {suggestions.map((item, idx) => (
                                <div 
                                    key={idx}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                    className="suggestion-item"
                                    onClick={() => {
                                        setSearchTerm(item.office);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                        {item.pincode.includes(searchTerm) ? <Hash size={16} color="var(--primary)" /> : <MapPin size={16} color="var(--primary)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.office}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.district}, {item.state} • {item.pincode}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <button 
                    onClick={handleGlobalExport}
                    className="glass-card"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        background: 'rgba(255,255,255,0.8)', 
                        padding: '10px 18px', 
                        borderRadius: '14px', 
                        border: '1px solid var(--border)', 
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: 'var(--shadow-glass)'
                    }}
                >
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Download size={14} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>Export Data</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div className="pulse-dot" style={{ backgroundColor: '#10B981', width: '8px', height: '8px' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Network</span>
                </div>
                
                <div style={{ width: '1px', height: '28px', background: 'var(--divider)' }} />
                
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button className="icon-btn glass-card" style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)', color: 'var(--primary)' }} aria-label="Notifications">
                        <Bell size={20} strokeWidth={2} />
                        <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%', border: '2px solid #fff' }} />
                    </button>
                    <button className="icon-btn glass-card" style={{ padding: '10px', borderRadius: '12px', background: 'var(--primary)', border: 'none', color: '#fff', boxShadow: 'var(--shadow-creative)' }} aria-label="User Profile">
                        <User size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </motion.header>
    );
};

export default TopNav;
