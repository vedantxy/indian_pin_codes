import React from 'react';
import Badge from '../ui/Badge';
import { MapPin, Building, Hash } from 'lucide-react';

const DataTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading records...</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <th style={{ padding: '12px 20px' }}>Office Name</th>
            <th>Pincode</th>
            <th>Taluk / District</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                    <Building size={16} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.officeName}</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  <Hash size={14} /> {item.pincode}
                </div>
              </td>
              <td>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.taluk}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.district}, {item.state}</p>
                </div>
              </td>
              <td style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                <Badge type={item.deliveryStatus === 'Delivery' ? 'success' : 'warning'}>
                  {item.deliveryStatus}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
