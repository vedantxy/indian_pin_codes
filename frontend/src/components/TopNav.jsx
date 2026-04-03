import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Settings, Command, User, Globe } from 'lucide-react';

const TopNav = () => {
    return (
        <motion.header 
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            className="top-nav"
        >
            <div className="search-bar-global">
                <Search size={16} color="var(--text-placeholder)" />
                <input 
                    type="text" 
                    placeholder="Search by pincode, area, or state..." 
                    aria-label="Global search"
                />
                <div style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-placeholder)', fontWeight: 600 }}>
                    <Command size={10} /> K
                </div>
            </div>
            
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--success-bg)', padding: '6px 12px', borderRadius: '99px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div className="pulse-dot" style={{ backgroundColor: 'var(--success)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803D' }}>Live Network</span>
                </div>
                
                <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn" style={{ padding: '8px', borderRadius: '10px', background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)' }} aria-label="Regional Info">
                        <Globe size={18} />
                    </button>
                    <button className="icon-btn" style={{ padding: '8px', borderRadius: '10px', background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)', position: 'relative' }} aria-label="Notifications">
                        <Bell size={18} />
                        <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: 'var(--error)', borderRadius: '50%', border: '2px solid white' }} />
                    </button>
                    <button className="icon-btn" style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} aria-label="User Profile">
                        <User size={18} />
                    </button>
                </div>
            </div>
        </motion.header>
    );
};

export default TopNav;
