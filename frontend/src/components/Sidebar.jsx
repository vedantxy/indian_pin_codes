import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, Layers, Download, MapPin, Settings, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pincode', label: 'Pincode Search', icon: Search },
    { id: 'states', label: 'State Directory', icon: Layers },
  ];

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="sidebar"
    >
      <div className="sidebar-header">
        <div style={{ background: '#3B82F6', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={20} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <span style={{ letterSpacing: '-0.5px' }}>Pincode <span>Explorer</span></span>
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            aria-label={`Go to ${item.label}`}
          >
            <item.icon size={18} strokeWidth={activeView === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div style={{ margin: '1.5rem 0.5rem', height: '1px', background: 'var(--divider)' }} />
        
        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-placeholder)', fontWeight: 600, letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '1rem' }}>
          Management
        </p>
        <button className="nav-item" aria-label="Export dataset">
          <Download size={18} />
          <span>Export Records</span>
        </button>
        <button className="nav-item" aria-label="Settings">
          <Settings size={18} />
          <span>General Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--divider)' }}>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
            VS
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Vedant Sharma</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project Admin</p>
          </div>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-placeholder)', cursor: 'pointer' }} aria-label="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
