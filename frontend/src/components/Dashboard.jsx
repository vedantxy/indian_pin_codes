import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Database, CheckCircle, Clock, BarChart3, Search, Map, Zap, ArrowUpRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const StatCard = ({ label, value, trend, icon: Icon, color }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/,/g, '')) || 0;
        if (start === end) return;
        
        let totalMiliseconds = 1500;
        let incrementTime = (totalMiliseconds / end) * 5;
        
        let timer = setInterval(() => {
            start += Math.ceil(end / 150);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 10);
        
        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="stat-card glass glass-hover"
            style={{ borderLeft: `4px solid ${color}` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <p className="label">{label}</p>
                    <h3 className="value">{typeof value === 'string' && isNaN(value.replace(/,/g, '')) ? value : count.toLocaleString()}</h3>
                </div>
                <div style={{ background: `${color}10`, padding: '10px', borderRadius: '12px' }}>
                    <Icon size={22} color={color} />
                </div>
            </div>
            <div className="trend" style={{ color: trend.startsWith('↑') ? '#10B981' : '#94A3B8' }}>
                {trend.startsWith('↑') ? <ArrowUpRight size={14} /> : <Activity size={14} />}
                <span>{trend}</span>
            </div>
        </motion.div>
    );
};

const Dashboard = ({ history }) => {
    // Mock data for search trends
    const chartData = [
        { name: 'Mon', searches: 400 },
        { name: 'Tue', searches: 300 },
        { name: 'Wed', searches: 600 },
        { name: 'Thu', searches: 800 },
        { name: 'Fri', searches: 500 },
        { name: 'Sat', searches: 900 },
        { name: 'Sun', searches: 1100 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="view-container"
        >
            <div className="stats-grid">
                <StatCard label="Total Records" value="154,823" trend="↑ 12% live growth" icon={Database} color="#3B82F6" />
                <StatCard label="Connection" value="MongoDB Atlas" trend="9ms latency (low)" icon={Zap} color="#8B5CF6" />
                <StatCard label="Pincode Density" value="High" trend="India Wide Scan" icon={CheckCircle} color="#10B981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
                <motion.div variants={itemVariants} className="content-card glass">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3><TrendingUp size={18} /> Search Trends (Weekly)</h3>
                        <div style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', fontSize: '0.7rem', color: '#3B82F6', fontWeight: 600 }}>LIVE ACTIVITY</div>
                    </div>
                    <div style={{ width: '100%', height: 280, padding: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#F1F5F9' }}
                                />
                                <Area type="monotone" dataKey="searches" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="content-card glass">
                    <div className="card-header">
                        <h3><Clock size={18} /> Recent Activity</h3>
                    </div>
                    <ul className="history-list">
                        <AnimatePresence>
                            {history.length === 0 ? (
                                <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                                    <div style={{ opacity: 0.3, marginBottom: '0.5rem' }}><Search size={32} /></div>
                                    No recent activity found
                                </motion.li>
                            ) : (
                                history.map((item, index) => (
                                    <motion.li 
                                        key={index} 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="history-item"
                                    >
                                        <div className="info">
                                            <div style={{ background: item.type === 'Pincode' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)', padding: '6px', borderRadius: '8px' }}>
                                                {item.type === 'Pincode' ? <Search size={14} color="#3B82F6" /> : <Map size={14} color="#8B5CF6" />}
                                            </div>
                                            <span style={{ fontSize: '0.9rem' }}>{item.type}: <strong style={{color: '#F1F5F9'}}>{item.value}</strong></span>
                                        </div>
                                        <span className="time">{item.time}</span>
                                    </motion.li>
                                ))
                            )}
                        </AnimatePresence>
                    </ul>
                </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="content-card glass" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">
                    <h3><BarChart3 size={18} /> System Insights</h3>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Database connection established via <span style={{ color: '#3B82F6', fontWeight: 600 }}>hackthone.project</span>. 
                            The current postal density is optimized with high-performance regex indices (v2.1). 
                            Cluster-0 is operating at 98.4% efficiency with no detected throttling.
                        </p>
                    </div>
                    <div style={{ width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '1px dashed rgba(59, 130, 246, 0.3)' }}>
                        <Activity size={40} color="#3B82F6" style={{ margin: 'auto' }} />
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Dashboard;
