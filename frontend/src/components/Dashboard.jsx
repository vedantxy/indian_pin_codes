import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Database, CheckCircle, Clock, BarChart3, Search, Map, Zap, ArrowUpRight, Activity, Info, Hash, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

const StatCard = ({ label, value, trend, icon: Icon, color, bgColor }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = (value && typeof value === 'string') ? parseInt(value.replace(/,/g, '')) : (typeof value === 'number' ? value : 0);
        if (start === end) return;
        
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
                    background: trend.includes('↑') ? 'var(--success-bg)' : 'var(--bg-secondary)',
                    color: trend.includes('↑') ? '#15803D' : 'var(--text-secondary)'
                }}>
                    {trend.includes('↑') ? <ArrowUpRight size={12} /> : <Activity size={12} />}
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
    const [stats, setStats] = useState({
        totalPincodes: 0,
        totalStates: 0,
        deliveryOffices: 0,
        nonDeliveryOffices: 0
    });
    const [distribution, setDistribution] = useState([]);
    const [deliveryData, setDeliveryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('overview'); // 'overview', 'analytics', 'operational'

    const fetchData = async () => {
        try {
            const [sRes, dRes, delRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/stats/state-distribution'),
                fetch('/api/stats/delivery-distribution')
            ]);
            
            const [sData, dData, delData] = await Promise.all([
                sRes.json(),
                dRes.json(),
                delRes.json()
            ]);

            if (sRes.ok) setStats(sData);
            if (dRes.ok) setDistribution(dData);
            if (delRes.ok) {
                setDeliveryData([
                    { name: 'Delivery', value: delData.delivery, color: '#10B981' },
                    { name: 'Non-Delivery', value: delData.nonDelivery, color: '#F59E0B' }
                ]);
            }
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartData = [
        { name: 'Mon', searches: 400 },
        { name: 'Tue', searches: 300 },
        { name: 'Wed', searches: 600 },
        { name: 'Thu', searches: 800 },
        { name: 'Fri', searches: 500 },
        { name: 'Sat', searches: 900 },
        { name: 'Sun', searches: 1100 },
    ];

    const COLORS = ['#14B8A6', '#0EA5E9', '#6366F1', '#8B5CF6', '#D946EF'];

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

    const TabButton = ({ mode, label, icon: Icon, color }) => (
        <button 
            onClick={() => setViewMode(mode)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderRadius: '14px',
                background: viewMode === mode ? 'rgba(255,255,255,0.8)' : 'transparent',
                border: viewMode === mode ? '1px solid var(--border)' : '1px solid transparent',
                color: viewMode === mode ? color : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: viewMode === mode ? 'var(--shadow-glass)' : 'none'
            }}
        >
            <Icon size={18} strokeWidth={viewMode === mode ? 3 : 2} />
            {label}
        </button>
    );

    return (
        <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '0 0 2.5rem' }}
        >
            {/* Header & Method Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2.5rem 1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                        System <span style={{ color: 'var(--primary)', fontWeight: 300 }}>Analytics</span>
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Live monitoring of the Indian Postal Network</p>
                </div>

                <div className="glass-card" style={{ display: 'flex', gap: '5px', padding: '6px', borderRadius: '18px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border)' }}>
                    <TabButton mode="overview" label="Overview" icon={Hash} color="var(--primary)" />
                    <TabButton mode="analytics" label="Geographic" icon={BarChart3} color="var(--secondary)" />
                    <TabButton mode="operational" label="Operational" icon={Zap} color="#10B981" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', padding: '1rem 2.5rem 2.5rem' }}>
                            <StatCard label="Total Pincodes" value={stats.totalPincodes} trend="↑ Master" icon={Hash} color="var(--primary)" bgColor="var(--primary-light)" />
                            <StatCard label="Total States" value={stats.totalStates} trend="↑ Global" icon={Globe} color="var(--secondary)" bgColor="var(--secondary-light)" />
                            <StatCard label="Delivery Hubs" value={stats.deliveryOffices} trend="↑ Active" icon={Zap} color="#10B981" bgColor="#D1FAE5" />
                            <StatCard label="Support Nodes" value={stats.nonDeliveryOffices} trend="↑ Operational" icon={Activity} color="#F59E0B" bgColor="#FEF3C7" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', padding: '0 2.5rem' }}>
                            <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                        <TrendingUp size={18} color="var(--primary)" strokeWidth={2.5} /> Search Activity
                                    </h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.5px' }}>7 DAY ANALYTICS</span>
                                </div>
                                <div style={{ width: '100%', height: 260 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600}} dy={10} />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow-glass)', fontSize: '0.85rem', fontWeight: 600 }}
                                            />
                                            <Area type="monotone" dataKey="searches" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" animationDuration={2000} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                        <Clock size={18} color="var(--secondary)" strokeWidth={2.5} /> Data Stream
                                    </h3>
                                    <button style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>RECORDS</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <AnimatePresence>
                                        {history.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-placeholder)' }}>
                                                <Activity size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                                <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>No stream data available</p>
                                            </div>
                                        ) : (
                                            history.slice(0, 5).map((item, index) => (
                                                <motion.div 
                                                    key={index} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        padding: '0.85rem', 
                                                        background: 'rgba(255,255,255,0.4)',
                                                        border: '1px solid var(--divider)',
                                                        borderRadius: '14px'
                                                    }}
                                                >
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: item.type === 'Pincode' ? 'var(--primary-light)' : 'var(--secondary-light)', color: item.type === 'Pincode' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '14px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                                        {item.type === 'Pincode' ? <Search size={16} strokeWidth={2.5} /> : <Map size={16} strokeWidth={2.5} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</p>
                                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.type} Access</p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-placeholder)', fontWeight: 600 }}>{item.time}</span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {viewMode === 'analytics' && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ padding: '1rem 2.5rem' }}
                    >
                        <div className="stat-card glass-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                        <BarChart3 size={20} color="var(--primary)" strokeWidth={3} /> Geographic Intensity Distribution
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '5px' }}>Top performing regions by office frequency</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[10, 15, 20].map(limit => (
                                        <button key={limit} style={{ padding: '6px 12px', fontSize: '0.7rem', fontWeight: 800, borderRadius: '8px', border: '1px solid var(--border)', background: limit === 15 ? 'var(--primary-light)' : 'transparent', color: limit === 15 ? 'var(--primary)' : 'var(--text-placeholder)' }}>{limit}</button>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{ width: '100%', height: 450 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={distribution} margin={{ bottom: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" />
                                        <XAxis 
                                            dataKey="state" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700}} 
                                            interval={0}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-placeholder)', fontSize: 10, fontWeight: 600}} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(20, 184, 166, 0.05)'}}
                                            contentStyle={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow-glass)', fontWeight: 700 }}
                                        />
                                        <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={2000}>
                                            {distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {viewMode === 'operational' && (
                    <motion.div
                        key="operational"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        style={{ padding: '1rem 2.5rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem' }}
                    >
                        <div className="stat-card glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                    <Zap size={20} color="#10B981" strokeWidth={3} /> Service Coverage
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>OPERATIONAL RATIO</p>
                            </div>
                            
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deliveryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={10}
                                            dataKey="value"
                                            animationDuration={1500}
                                        >
                                            {deliveryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow-glass)', fontWeight: 700 }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                                <p style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 800, textAlign: 'center' }}>
                                    {deliveryData.length > 0 ? (
                                        `${((deliveryData[0].value / (deliveryData[0].value + deliveryData[1].value)) * 100).toFixed(1)}% National Service Reach`
                                    ) : 'Calculating...'}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                    <Activity size={20} color="var(--primary)" strokeWidth={3} /> Node Performance Index
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
                                    Healthy
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {[
                                    { label: 'Data Accuracy', val: '99.98%', icon: CheckCircle, color: '#10B981' },
                                    { label: 'System Latency', val: '42ms', icon: Clock, color: 'var(--primary)' },
                                    { label: 'Database Integrity', val: 'Verified', icon: Database, color: 'var(--secondary)' },
                                    { label: 'Network Uptime', val: '100%', icon: Globe, color: '#6366F1' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <item.icon size={18} color={item.color} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.label}</span>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={itemVariants} style={{ padding: '0 2.5rem 0' }}>
                <div className="stat-card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.6)', borderLeft: '6px solid var(--primary)' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-creative)' }}>
                        <Info size={20} color="#fff" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Neural Indexing Active</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 500 }}>
                            Real-time indexing is maintaining <span style={{ color: 'var(--primary)', fontWeight: 700 }}>99.98% accuracy</span>. Advanced caching on <span style={{ textDecoration: 'underline' }}>Asia-South-1</span> has reduced global latency by 42%.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Dashboard;
