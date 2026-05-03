import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Filter, Search, Download } from 'lucide-react';
import { toast } from 'react-toastify';

import FilterPanel from '../components/explore/FilterPanel.jsx';
import DataTable from '../components/explore/DataTable.jsx';
import Pagination from '../components/explore/Pagination.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const Explore = () => {
  const [filters, setFilters] = useState({ state: '', district: '', taluk: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page,
        limit: 15
      });
      const res = await fetch(`/api/pincodes?${queryParams.toString()}`);
      const result = await res.json();
      if (res.ok) {
        setData(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      toast.error('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [filters, page]);

  const handleExport = () => {
    const queryParams = new URLSearchParams(filters);
    window.location.href = `/api/export?${queryParams.toString()}`;
    toast.success('Export initiated for current filters');
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '1.5rem 2.5rem 3rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>Location Index</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Browse and filter through the master postal network</p>
        </div>
        <button 
          onClick={handleExport}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: 800, boxShadow: 'var(--shadow-creative)' }}
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Filters */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <FilterPanel onFilterChange={(f) => { setFilters(f); setPage(1); }} />
        </div>

        {/* Right: Data Table */}
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.4)', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <Database size={18} color="var(--primary)" /> Records Table
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {total.toLocaleString()} TOTAL MATCHES
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '10rem 0' }}><Spinner size="50px" /></div>
          ) : data.length > 0 ? (
            <>
              <DataTable data={data} />
              <Pagination 
                currentPage={page} 
                totalPages={Math.ceil(total / 15)} 
                onPageChange={setPage} 
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Explore;
