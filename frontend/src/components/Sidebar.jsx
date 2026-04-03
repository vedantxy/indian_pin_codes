import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, Layers, Download, MapPin, Settings, HelpCircle } from 'lucide-react';

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
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '12px' }}>
          <MapPin size={24} color="#3B82F6" />
        </div>
        <span>Post-It <span>Admin</span></span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            aria-label={`Go to ${item.label}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div style={{ margin: '1.5rem 0', height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#475569', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '1rem' }}>
          Utilities
        </p>
        <button className="nav-item" aria-label="Export dataset">
          <Download size={20} />
          <span>Export Data</span>
        </button>
        <button className="nav-item" aria-label="Settings">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="user-info">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>V</div>
          <div style={{ overflow: 'hidden' }}>
            <p className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Vedant</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
