import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, Layers, Download, MapPin, Settings, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pincode', label: 'Pincode Search', icon: Search },
    { id: 'states', icon: Layers, label: 'State Directory' },
    { id: 'location', icon: Navigation, label: 'Location Index' },
  ];

  const handleExport = () => {
    window.location.href = '/api/export';
    toast.info('Downloading master postal records...');
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="sidebar glass-card"
      style={{ 
        borderRight: '1px solid var(--border)',
        margin: '1rem',
        height: 'calc(100vh - 2rem)',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.4)',
        boxShadow: 'var(--shadow-glass)'
      }}
    >
      <div className="sidebar-header" style={{ padding: '1.5rem 1rem' }}>
        <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-creative)' }}>
          <MapPin size={22} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Pincode <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Explorer</span></span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '2px' }}>Network Admin</span>
        </div>
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1, padding: '0 1rem' }}>
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            style={{ 
               padding: '1rem',
               marginBottom: '0.5rem',
               borderRadius: '16px',
               border: activeView === item.id ? '1px solid var(--border)' : '1px solid transparent'
            }}
          >
            <div style={{ 
              background: activeView === item.id ? 'var(--bg-main)' : 'transparent',
              padding: '6px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeView === item.id ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
            }}>
              <item.icon size={18} color={activeView === item.id ? 'var(--primary)' : 'var(--text-secondary)'} strokeWidth={activeView === item.id ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: activeView === item.id ? 700 : 500 }}>{item.label}</span>
          </button>
        ))}
        
        <div style={{ margin: '2rem 1rem', height: '1px', background: 'var(--divider)', opacity: 0.5 }} />
        
        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-placeholder)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '1.25rem', paddingLeft: '1rem' }}>
          Management
        </p>
        
        <button 
            className={`nav-item ${activeView === 'downloads' ? 'active' : ''}`}
            onClick={() => setActiveView('downloads')}
            style={{ 
                padding: '1rem',
                marginBottom: '0.5rem',
                borderRadius: '16px',
                border: activeView === 'downloads' ? '1px solid var(--border)' : '1px solid transparent'
            }}
        >
            <div style={{ 
                background: activeView === 'downloads' ? 'var(--bg-main)' : 'transparent',
                padding: '6px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeView === 'downloads' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
            }}>
                <Download size={18} color={activeView === 'downloads' ? 'var(--primary)' : 'var(--text-secondary)'} strokeWidth={activeView === 'downloads' ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: activeView === 'downloads' ? 700 : 500 }}>Export Data</span>
        </button>

        <button className="nav-item" style={{ padding: '1rem' }}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--divider)' }}>
        <div className="user-info glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'var(--shadow-glass)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(94, 126, 143, 0.3)' }}>
            VP
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: '2px' }}>Vedant Patel</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Admin</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
