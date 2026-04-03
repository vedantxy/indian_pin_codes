import React from 'react';
import { TrendingUp, Database, CheckCircle, Clock, BarChart3, Search, Map } from 'lucide-react';

const Dashboard = ({ history }) => {
    return (
        <section className="view-container">
            <div className="stats-row">
                <div className="stat-card">
                    <p className="label">Total Records</p>
                    <h3>154,823</h3>
                    <div className="trend positive"><TrendingUp size={14} /> Live Tracking</div>
                </div>
                <div className="stat-card">
                    <p className="label">Connection</p>
                    <h3>MongoDB Atlas</h3>
                    <div className="trend"><Database size={14} /> Cluster-0</div>
                </div>
                <div className="stat-card">
                    <p className="label">Pincode Density</p>
                    <h3>High</h3>
                    <div className="trend positive"><CheckCircle size={14} /> India Wide</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="content-card">
                    <div className="card-header">
                        <h3><Clock size={18} /> Recent Activity</h3>
                    </div>
                    <ul className="history-list">
                        {history.length === 0 ? (
                            <li className="empty-state">No recent activity found</li>
                        ) : (
                            history.map((item, index) => (
                                <li key={index} className="history-item">
                                    <div className="info">
                                        {item.type === 'Pincode' ? <Search size={16} /> : <Map size={16} />}
                                        <span>{item.type}: <strong>{item.value}</strong></span>
                                    </div>
                                    <span className="time">{item.time}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="content-card">
                    <div className="card-header">
                        <h3><BarChart3 size={18} /> System Insights</h3>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            Database connected to <span style={{ color: '#2563eb', fontWeight: 600 }}>hackthone.project</span>. 
                            Optimized for performance with regex lookups and resilient data trimming.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
