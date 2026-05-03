import React from 'react';

const Badge = ({ children, type = 'primary', style = {} }) => {
  const getColors = () => {
    switch (type) {
      case 'success': return { bg: 'var(--success-bg)', text: '#15803D' };
      case 'warning': return { bg: '#FEF3C7', text: '#B45309' };
      case 'error': return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'secondary': return { bg: 'var(--secondary-light)', text: 'var(--secondary)' };
      default: return { bg: 'var(--primary-light)', text: 'var(--primary)' };
    }
  };

  const colors = getColors();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '0.7rem',
      fontWeight: 800,
      background: colors.bg,
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      ...style
    }}>
      {children}
    </span>
  );
};

export default Badge;
