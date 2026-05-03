import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ message = "No data available", subtext = "Try adjusting your filters or search query." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ 
        textAlign: 'center', 
        padding: '5rem 0', 
        color: 'var(--text-placeholder)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ 
        background: 'rgba(255,255,255,0.4)', 
        width: '80px', 
        height: '80px', 
        borderRadius: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '1.5rem', 
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-glass)'
      }}>
        <Info size={40} style={{ opacity: 0.3 }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{message}</h3>
      <p style={{ fontWeight: 500, maxWidth: '300px', lineHeight: '1.5' }}>{subtext}</p>
    </motion.div>
  );
};

export default EmptyState;
