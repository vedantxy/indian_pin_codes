import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, ChevronRight, Map, MapPin, Building, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const DistrictGroup = ({ district, offices, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ marginBottom: '1rem' }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.25rem 1.5rem', 
          background: isOpen ? 'var(--primary-light)' : 'rgba(255,255,255,0.4)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: isOpen ? 'var(--primary)' : 'var(--bg-main)', color: isOpen ? '#fff' : 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
            <MapPin size={18} />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{district}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.5)', padding: '4px 10px', borderRadius: '6px' }}>
            {offices.length} UNITS
          </span>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
            <ChevronRight size={18} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', padding: '0 1rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', padding: '1rem 0' }}>
              {offices.map((office, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', border: '1px solid var(--divider)' }}>
                  <Building size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{office}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StateDirectory = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/states').then(res => res.json()).then(setStates).catch(console.error);
  }, []);

  const handleBrowse = async () => {
    if (!selectedState) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/states/${encodeURIComponent(selectedState)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      toast.error('Failed to load state directory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem 2.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Regional Archives</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Browse the postal network hierarchy by state and district</p>
          </div>
          <Archive size={48} style={{ opacity: 0.1 }} />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Map size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', border: '1px solid var(--border)', background: '#fff', fontSize: '1rem', fontWeight: 700, appearance: 'none' }}
            >
              <option value="">Select a state to explore...</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button 
            onClick={handleBrowse}
            disabled={loading || !selectedState}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0 30px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            {loading ? <Spinner size="18px" color="#fff" /> : <><Search size={18} /> Explore</>}
          </button>
        </div>

        <div>
          {loading ? (
            <div style={{ padding: '5rem 0' }}><Spinner size="60px" /></div>
          ) : results ? (
            Object.entries(results).length > 0 ? (
              Object.entries(results).map(([district, offices], i) => (
                <DistrictGroup key={i} district={district} offices={offices} index={i} />
              ))
            ) : (
              <EmptyState message="No districts found" />
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.4 }}>
              <Archive size={100} style={{ marginBottom: '1.5rem' }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Select a state to view its administrative hierarchy</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default StateDirectory;
