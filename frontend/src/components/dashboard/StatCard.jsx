import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Activity } from 'lucide-react';

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

export default StatCard;
