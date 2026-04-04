import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import PincodeSearch from './components/PincodeSearch';
import StateDirectory from './components/StateDirectory';
import LocationPicker from './components/LocationPicker';
import ExportView from './components/ExportView';

const App = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [searchHistory, setSearchHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    });
    const [states, setStates] = useState([]);
    const [pincodeResults, setPincodeResults] = useState(null);
    const [stateResults, setStateResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch('/api/states');
                if (res.ok) {
                    const data = await res.json();
                    setStates(data);
                }
            } catch (err) {
                console.error('Error fetching states:', err);
                toast.error('Failed to load Indian states network');
            }
        };
        fetchStates();
    }, []);

    const addToHistory = (type, value) => {
        const newItem = { 
            type, 
            value, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        const newHistory = [newItem, ...searchHistory.slice(0, 9)];
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const handlePincodeSearch = async (pincode) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/pincode/${pincode}`);
            const data = await res.json();
            if (res.ok) {
                setPincodeResults(data);
                addToHistory('Pincode', pincode);
                toast.success(`Success! Found ${data.length} offices for ${pincode}`);
            } else {
                setPincodeResults([]);
                toast.warning(data.message || 'No data found for this pincode');
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Network error during pincode retrieval');
        } finally {
            setLoading(false);
        }
    };

    const handleStateBrowse = async (stateName) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/states/${encodeURIComponent(stateName)}`);
            const data = await res.json();
            if (res.ok) {
                setStateResults(data);
                addToHistory('State', stateName);
                const districtCount = Object.keys(data).length;
                toast.success(`Loaded ${districtCount} districts for ${stateName}`);
            } else {
                setStateResults({});
                toast.warning(data.message || 'Could not load state directory');
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Network error during state directory fetch');
        } finally {
            setLoading(false);
        }
    };

    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -20 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.4
    };

    return (
        <div className="admin-theme">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            
            <main className="main-content">
                <TopNav />
                
                <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            style={{ height: '100%' }}
                        >
                            {activeView === 'dashboard' && (
                                <Dashboard history={searchHistory} />
                            )}
                            
                            {activeView === 'pincode' && (
                                <PincodeSearch 
                                    onSearch={handlePincodeSearch} 
                                    results={pincodeResults} 
                                    loading={loading} 
                                />
                            )}
                            
                            {activeView === 'states' && (
                                <StateDirectory 
                                    states={states} 
                                    onBrowse={handleStateBrowse} 
                                    results={stateResults} 
                                    loading={loading} 
                                />
                            )}

                            {activeView === 'location' && (
                                <LocationPicker states={states} />
                            )}

                            {activeView === 'downloads' && (
                                <ExportView states={states} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default App;
