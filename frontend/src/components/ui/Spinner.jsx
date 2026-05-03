import React from 'react';

const Spinner = ({ size = '24px', color = 'var(--primary)', thickness = '3px' }) => {
  return (
    <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div className="spinner" style={{ 
        width: size, 
        height: size, 
        borderWidth: thickness,
        borderTopColor: color 
      }} />
    </div>
  );
};

export default Spinner;
