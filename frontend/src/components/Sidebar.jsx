import React from 'react';
import { LayoutDashboard, Search, Layers, Download, MapPin } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <MapPin size={24} />
        <span>Post-It <span>Admin</span></span>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button 
          className={`nav-item ${activeView === 'pincode' ? 'active' : ''}`}
          onClick={() => setActiveView('pincode')}
        >
          <Search size={20} /> Pincode Search
        </button>
        <button 
          className={`nav-item ${activeView === 'states' ? 'active' : ''}`}
          onClick={() => setActiveView('states')}
        >
          <Layers size={20} /> State Directory
        </button>
        <div className="divider"></div>
        <div className="nav-label">Utilities</div>
        <button className="nav-item">
          <Download size={20} /> Export data
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">V</div>
          <div>
            <p className="user-name">Vedant</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
