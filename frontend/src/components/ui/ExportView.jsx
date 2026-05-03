import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Database, Layers, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ExportView = ({ states }) => {
    const [selectedState, setSelectedState] = useState('');
    const [exportLoading, setExportLoading] = useState(false);

    const handleGlobalExport = () => {
        setExportLoading(true);
        try {
            window.location.href = '/api/export';
            toast.success('Initiating Master Export: Entire postal network database.');
        } catch (err) {
            toast.error('Export failed. Please check network connection.');
        } finally {
            setTimeout(() => setExportLoading(false), 2000);
        }
    };

    const handleRegionalExport = () => {
        if (!selectedState) {
            toast.warning('Please select a jurisdiction for regional export.');
            return;
        }
        window.location.href = `/api/export?state=${encodeURIComponent(selectedState)}`;
        toast.info(`Exporting regional records for: ${selectedState}`);
    };

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
        <section style={{ padding: '2.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <Database size={14} strokeWidth={3} /> DATA ARCHIVE MANAGEMENT
                </div>
                <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>Export <span style={{ color: 'var(--primary)', fontWeight: 300 }}>Records</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: '1.7', fontSize: '1rem', fontWeight: 500 }}>
                    Extract granular postal network datasets in standardized CSV format for administrative reporting and external analysis.
                </p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}
            >
                {/* Master Export Card */}
                <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                        <Database size={120} />
                    </div>
                    <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.5rem', boxShadow: 'var(--shadow-creative)' }}>
                        <Download size={24} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Master Export</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Generate a comprehensive CSV file containing every registered pincode and office in the national network hub.
                    </p>
                    <button 
                        className="primary-btn" 
                        onClick={handleGlobalExport} 
                        disabled={exportLoading}
                        style={{ width: '100%', borderRadius: '14px', height: '52px' }}
                    >
                        {exportLoading ? 'PREPARING STREAM...' : 'DOWNLOAD MASTER CSV'}
                    </button>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle size={14} /> System Online • Ready for Export
                    </div>
                </motion.div>

                {/* Regional Export Card */}
                <motion.div variants={itemVariants} className="stat-card glass-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)' }}>
                    <div style={{ background: 'var(--secondary)', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.5rem', boxShadow: 'var(--shadow-creative)' }}>
                        <Layers size={24} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Regional Export</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Filter and extract data for a specific state jurisdiction for localized topographic analysis.
                    </p>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <select 
                            className="floating-input"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            style={{ borderRadius: '14px', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border)', padding: '0 1rem', height: '48px', fontWeight: 700 }}
                        >
                            <option value="">Select Target State...</option>
                            {states.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="primary-btn" 
                        onClick={handleRegionalExport}
                        style={{ width: '100%', borderRadius: '14px', height: '52px', background: 'var(--secondary)' }}
                    >
                        GENERATE REGIONAL CSV
                    </button>
                </motion.div>
            </motion.div>

            {/* Information Alert */}
            <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem', background: 'rgba(94, 126, 143, 0.05)', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
                <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text-primary)' }}>Export Policy & Specifications</h4>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', listStyleType: 'disc', paddingLeft: '1.25rem', lineHeight: '1.8' }}>
                        <li>CSV files use UTF-8 encoding and comma delimiters.</li>
                        <li>Export contains: Pincode, Office Name, Taluk, District, State, and Delivery Status.</li>
                        <li>Process may take up to 30 seconds for the Master Export depending on database load.</li>
                    </ul>
                </div>
            </motion.div>
        </section>
    );
};

export default ExportView;
