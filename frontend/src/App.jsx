import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import PincodeSearch from './components/PincodeSearch';
import StateDirectory from './components/StateDirectory';

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
                const res = await fetch('/states');
                if (res.ok) {
                    const data = await res.json();
                    setStates(data);
                }
            } catch (err) {
                console.error('Error fetching states:', err);
            }
        };
        fetchStates();
    }, []);

    const addToHistory = (type, value) => {
        const newItem = { type, value, time: new Date().toLocaleTimeString() };
        const newHistory = [newItem, ...searchHistory.slice(0, 9)];
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const handlePincodeSearch = async (pincode) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/${pincode}`);
            const data = await res.json();
            if (res.ok) {
                setPincodeResults(data);
                addToHistory('Pincode', pincode);
            } else {
                setPincodeResults([]);
                alert(data.message || 'Error fetching pincode details');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to fetch pincode details');
        } finally {
            setLoading(false);
        }
    };

    const handleStateBrowse = async (stateName) => {
        setLoading(true);
        try {
            const res = await fetch(`/states/${encodeURIComponent(stateName)}`);
            const data = await res.json();
            if (res.ok) {
                setStateResults(data);
                addToHistory('State', stateName);
            } else {
                setStateResults({});
                alert(data.message || 'Error fetching state directory');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to fetch state directory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-theme">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            
            <main className="main-content">
                <TopNav />
                
                <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
                    {loading && (
                        <div className="loader-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'rgba(248, 250, 252, 0.8)' }}>
                            <div className="spinner"></div>
                            <p style={{ fontWeight: 600, color: '#2563eb' }}>Scanning global database...</p>
                        </div>
                    )}
                    
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
                </div>
            </main>
        </div>
    );
};

export default App;
