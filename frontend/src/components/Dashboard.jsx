import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Database, CheckCircle, Clock, BarChart3, Search, Map, Zap, ArrowUpRight, Activity, Info, Hash, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import IndiaMap from './IndiaMap';

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
    const [stateReach, setStateReach] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {
        try {
            const [sRes, dRes, delRes, reachRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/stats/state-distribution'),
                fetch('/api/stats/delivery-distribution'),
                fetch('/api/stats/state-reach')
            ]);
            
            const [sData, dData, delData, reachData] = await Promise.all([
                sRes.json(),
                dRes.json(),
                delRes.json(),
                reachRes.json()
            ]);

            if (sRes.ok) setStats(sData);
            if (dRes.ok) setDistribution(dData);
            if (reachRes.ok) setStateReach(reachData);
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

    return (
        <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '0 0 2.5rem' }}
        >
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', padding: '1.5rem 2.5rem 2.5rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '1.6rem', padding: '1.5rem 2.5rem' }}>
                <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>STATE DISTRIBUTION</h3>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>Regional pincode volume • <span style={{ color: 'var(--success)' }}>Live</span></h2>
                        </div>
                    </div>
                    
                    <div style={{ width: '100%', height: 450, position: 'relative' }}>
                        <IndiaMap distribution={distribution} />
                    </div>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                    <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.6)' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '1px' }}>SERVICE REACH</h3>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>Network efficiency</h2>
                        </div>
                        
                        <div style={{ width: '100%', height: 180, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deliveryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {deliveryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                    {deliveryData.length > 0 ? `${((deliveryData[0].value / (deliveryData[0].value + deliveryData[1].value)) * 100).toFixed(1)}%` : '0%'}
                                </p>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>delivery</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></div> Delivery
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}></div> Non-delivery
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total pincodes</p>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.totalPincodes.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>Delivery enabled</p>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)' }}>{stats.deliveryOffices.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>Non-delivery</p>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F59E0B' }}>{stats.nonDeliveryOffices.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.6)' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>TOP STATES BY REACH</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stateReach.slice(0, 5).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.state}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'var(--success-bg)', color: '#15803D', padding: '4px 8px', borderRadius: '6px' }}>{item.reach.toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
            
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
