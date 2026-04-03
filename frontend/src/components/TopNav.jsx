import React from 'react';
import { Search, Bell } from 'lucide-react';

const TopNav = () => {
    return (
        <header className="top-nav">
            <div className="search-bar-global">
                <Search size={20} color="#64748b" />
                <input type="text" placeholder="Search anything (pincode, office, state)..." />
            </div>
            <div className="header-actions">
                <div className="badge">Local Connection: Stable</div>
                <Bell size={20} className="icon-btn" />
            </div>
        </header>
    );
};

export default TopNav;
