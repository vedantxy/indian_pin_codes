import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Database, CheckCircle, Clock, BarChart3, Search, Map, Zap, ArrowUpRight, Activity, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, value, trend, icon: Icon, color, bgColor }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/,/g, '')) || 0;
        if (start === end) return;
        
        let totalMiliseconds = 1500;
        let incrementTime = (totalMiliseconds / end) * 5;
        
        let timer = setInterval(() => {
            start += Math.ceil(end / 100);
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
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="stat-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                <div style={{ background: bgColor, padding: '12px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={color} strokeWidth={2.5} />
                </div>
                <div className="trend" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.7rem', 
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: trend.startsWith('↑') ? 'var(--success-bg)' : 'var(--bg-secondary)',
                    color: trend.startsWith('↑') ? '#15803D' : 'var(--text-secondary)'
                }}>
                    {trend.startsWith('↑') ? <ArrowUpRight size={12} /> : <Activity size={12} />}
                    <span>{trend.split(' ')[1] || trend}</span>
                </div>
            </div>
            
            <p className="label">{label}</p>
            <h3 className="value" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
                {typeof value === 'string' && isNaN(value.replace(/,/g, '')) ? value : count.toLocaleString()}
            </h3>
        </motion.div>
    );
};

const Dashboard = ({ history }) => {
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
            style={{ padding: '0 0 2.5rem' }}
        >
            <div className="stats-grid">
                <StatCard label="Total Records" value="154,823" trend="↑ 12.5%" icon={Database} color="#3B82F6" bgColor="#DBEAFE" />
                <StatCard label="Server Status" value="Online" trend="Active" icon={Zap} color="#8B5CF6" bgColor="#F3E8FF" />
                <StatCard label="Live Connection" value="Stable" trend="↑ 99.9%" icon={CheckCircle} color="#10B981" bgColor="#DCFCE7" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', padding: '0 2.5rem' }}>
                <motion.div variants={itemVariants} className="stat-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TrendingUp size={18} color="var(--primary)" /> Search Volume
                        </h3>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LAST 7 DAYS</span>
                    </div>
                    <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 11}} dy={10} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', fontSize: '0.85rem' }}
                                />
                                <Area type="monotone" dataKey="searches" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSearches)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="stat-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={18} color="var(--secondary)" /> Recent Activity
                        </h3>
                        <button style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>VIEW ALL</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <AnimatePresence>
                            {history.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-placeholder)' }}>
                                    <Activity size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ fontSize: '0.85rem' }}>No activity records yet</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            padding: '0.85rem', 
                                            background: index % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: item.type === 'Pincode' ? 'var(--primary-light)' : 'var(--secondary-light)', color: item.type === 'Pincode' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                            {item.type === 'Pincode' ? <Search size={14} /> : <Map size={14} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.type} Lookup</p>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-placeholder)' }}>{item.time}</span>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
            
            <motion.div variants={itemVariants} style={{ padding: '1.5rem 2.5rem 0' }}>
                <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right, #F9FAFB, #FFFFFF)', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '12px' }}>
                        <Info size={20} color="var(--primary)" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>System Performance Insight</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Database latency is currently <span style={{ color: '#10B981', fontWeight: 600 }}>8.4ms</span>. Cluster-0 is healthy and synchronization across Atlas nodes is at 100% efficiency.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Dashboard;
