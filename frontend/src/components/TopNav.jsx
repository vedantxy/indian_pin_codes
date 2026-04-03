import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Settings, Command } from 'lucide-react';

const TopNav = () => {
    return (
        <motion.header 
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            className="top-nav"
        >
            <div className="search-bar-global">
                <Search size={18} color="#94A3B8" />
                <input 
                    type="text" 
                    placeholder="Search anything (pincode, office, state)..." 
                    aria-label="Global search"
                />
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                    <Command size={10} /> K
                </div>
            </div>
            
            <div className="header-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.05)', padding: '6px 12px', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="pulse-dot" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>Live: MongoDB Atlas</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="icon-btn" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} aria-label="Notifications">
                        <Bell size={18} />
                    </button>
                    <button className="icon-btn" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} aria-label="User settings">
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </motion.header>
    );
};

export default TopNav;
