import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="glass-card"
        style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        <ChevronLeft size={18} />
      </button>
      
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        Page <span style={{ color: 'var(--text-primary)' }}>{currentPage}</span> of {totalPages}
      </span>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="glass-card"
        style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
