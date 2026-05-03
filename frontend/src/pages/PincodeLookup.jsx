import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, Globe, Info, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

import PincodeDetailCard from '../components/pincode/PincodeDetailCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!pincode || pincode.length < 3) {
      toast.warn('Please enter at least 3 digits');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search/${pincode}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '3rem 2.5rem' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1.5px', marginBottom: '1rem' }}>Pincode Lookup</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600, maxWidth: '600px', margin: '0 auto' }}>
            Instantly retrieve detailed information for any postal code in the network.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px 10px 10px 24px', 
            borderRadius: '24px', 
            background: 'rgba(255,255,255,0.6)', 
            boxShadow: 'var(--shadow-creative)',
            border: '2px solid var(--primary-light)'
          }}>
            <Hash size={24} color="var(--primary)" style={{ marginRight: '16px' }} />
            <input 
              type="text" 
              placeholder="Enter 6-digit pincode (e.g. 110001)..." 
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}
            />
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                border: 'none', 
                padding: '12px 32px', 
                borderRadius: '18px', 
                fontWeight: 800, 
                fontSize: '1rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }}
            >
              {loading ? <Spinner size="20px" color="#fff" /> : <><Search size={20} /> Search</>}
            </button>
          </div>
        </form>

        {/* Results */}
        <div style={{ minHeight: '400px' }}>
          {loading ? (
            <div style={{ padding: '5rem 0' }}><Spinner size="60px" /></div>
          ) : results.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <AnimatePresence>
                {results.map((office, idx) => (
                  <PincodeDetailCard key={idx} office={office} />
                ))}
              </AnimatePresence>
            </div>
          ) : searched ? (
            <EmptyState message="No results found" subtext={`We couldn't find any postal data for "${pincode}". Please verify the number.`} />
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
              <Globe size={80} color="var(--primary-light)" style={{ marginBottom: '1.5rem' }} />
              <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Enter a pincode above to start browsing</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default PincodeLookup;
