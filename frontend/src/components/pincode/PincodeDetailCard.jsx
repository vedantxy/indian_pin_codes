import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, Hash, Zap, Navigation } from 'lucide-react';
import Badge from '../ui/Badge';

const PincodeDetailCard = ({ office }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ 
        padding: '1.5rem', 
        background: 'rgba(255,255,255,0.4)', 
        border: '1px solid var(--border)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: '#fff' }}>
            <Building size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{office.officeName}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Hash size={14} /> {office.pincode}
            </div>
          </div>
        </div>
        <Badge type={office.deliveryStatus === 'Delivery' ? 'success' : 'warning'}>
          {office.deliveryStatus}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.3)', padding: '12px', borderRadius: '14px', border: '1px solid var(--divider)' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', marginBottom: '4px' }}>District</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--secondary)" /> {office.district}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.3)', padding: '12px', borderRadius: '14px', border: '1px solid var(--divider)' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', marginBottom: '4px' }}>Taluk</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={14} color="var(--primary)" /> {office.taluk}
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          State: <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{office.state}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default PincodeDetailCard;
