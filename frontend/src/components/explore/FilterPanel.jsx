import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, Globe, Navigation, Building, Filter, RefreshCcw, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const FilterPanel = ({ onFilterChange }) => {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [taluks, setTaluks] = useState([]);
    const [selectedTaluk, setSelectedTaluk] = useState('');
    
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTaluks, setLoadingTaluks] = useState(false);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const res = await fetch('/api/states');
                const data = await res.json();
                if (res.ok && Array.isArray(data)) {
                    setStates(data);
                } else {
                    setStates([]);
                }
            } catch (err) {
                console.error('States fetch error:', err);
                setStates([]);
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    // Effect to notify parent of filter changes safely
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            if (typeof onFilterChange === 'function') {
                onFilterChange({
                    state: selectedState,
                    district: selectedDistrict,
                    taluk: selectedTaluk
                });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [selectedState, selectedDistrict, selectedTaluk]);

    // Reset when state changes
    useEffect(() => {
        if (selectedState) {
            fetchDistricts(selectedState);
        } else {
            setDistricts([]);
            setTaluks([]);
        }
        setSelectedDistrict('');
        setSelectedTaluk('');
    }, [selectedState]);

    // Reset when district changes
    useEffect(() => {
        if (selectedDistrict) {
            fetchTaluks(selectedState, selectedDistrict);
        } else {
            setTaluks([]);
        }
        setSelectedTaluk('');
    }, [selectedDistrict]);

    const fetchDistricts = async (stateName) => {
        if (!stateName) return;
        setLoadingDistricts(true);
        try {
            const res = await fetch(`/api/states/${encodeURIComponent(stateName)}/districts`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setDistricts(data);
            } else {
                setDistricts([]);
            }
        } catch (err) {
            console.error('Districts fetch error:', err);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchTaluks = async (stateName, districtName) => {
        if (!stateName || !districtName) return;
        setLoadingTaluks(true);
        try {
            const res = await fetch(`/api/states/${encodeURIComponent(stateName)}/districts/${encodeURIComponent(districtName)}/taluks`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setTaluks(data);
            } else {
                setTaluks([]);
            }
        } catch (err) {
            console.error('Taluks fetch error:', err);
            setTaluks([]);
        } finally {
            setLoadingTaluks(false);
        }
    };

    const handleReset = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedTaluk('');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card" 
            style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--border)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Filter size={16} color="var(--primary)" /> FILTER OPTIONS
                </h3>
                <button 
                    onClick={handleReset}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800 }}
                >
                    <RefreshCcw size={12} /> RESET
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* State Selection */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        State Jurisdiction
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select 
                            style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.85rem', fontWeight: 700, appearance: 'none', cursor: 'pointer' }}
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="">{loadingStates ? 'Loading...' : 'All States'}</option>
                            {Array.isArray(states) && states.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <ChevronDown size={14} color="var(--primary)" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* District Selection */}
                <div style={{ position: 'relative', opacity: selectedState ? 1 : 0.5 }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        District Office
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select 
                            style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.85rem', fontWeight: 700, appearance: 'none', cursor: selectedState ? 'pointer' : 'not-allowed' }}
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                        >
                            <option value="">{loadingDistricts ? 'Loading...' : 'All Districts'}</option>
                            {Array.isArray(districts) && districts.map((d, i) => (
                                <option key={i} value={d}>{d}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <ChevronDown size={14} color="var(--primary)" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Taluk Selection */}
                <div style={{ position: 'relative', opacity: selectedDistrict ? 1 : 0.5 }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-placeholder)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Local Taluk / City
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select 
                            style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.85rem', fontWeight: 700, appearance: 'none', cursor: selectedDistrict ? 'pointer' : 'not-allowed' }}
                            value={selectedTaluk}
                            onChange={(e) => setSelectedTaluk(e.target.value)}
                            disabled={!selectedDistrict}
                        >
                            <option value="">{loadingTaluks ? 'Searching...' : 'All Taluks'}</option>
                            {Array.isArray(taluks) && taluks.map((t, i) => (
                                <option key={i} value={t}>{t}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <ChevronDown size={14} color="var(--primary)" strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                    <Info size={16} />
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: '1.4' }}>
                        Filters update the records table in real-time. Use reset to clear all jurisdictions.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default FilterPanel;
