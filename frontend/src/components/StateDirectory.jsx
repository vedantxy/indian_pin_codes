import React, { useState, useEffect } from 'react';
import { Map } from 'lucide-react';

const StateDirectory = ({ states, onBrowse, results, loading }) => {
    const [selectedState, setSelectedState] = useState('');

    const handleBrowse = () => {
        if (selectedState) {
            onBrowse(selectedState);
        }
    };

    return (
        <section className="view-container">
            <div className="search-hero">
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>State Directory</h2>
                <div className="search-input-group">
                    <select 
                        value={selectedState} 
                        onChange={(e) => setSelectedState(e.target.value)}
                    >
                        <option value="" disabled>Choose a state...</option>
                        {states.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}
                    </select>
                    <button onClick={handleBrowse} disabled={loading}>
                        {loading ? 'Viewing...' : 'View Network'}
                    </button>
                </div>
            </div>

            {results && Object.keys(results).length > 0 && (
                <div className="results-container">
                    {Object.entries(results).map(([district, cities], i) => (
                        <div key={i} className="district-group">
                            <div className="district-title">
                                <Map size={18} /> {district} ({cities.length} Offices)
                            </div>
                            <div className="results-grid">
                                {cities.map((city, j) => (
                                    <div key={j} className="stat-card" style={{ padding: '1rem', background: 'white' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>{city}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results && Object.keys(results).length === 0 && !loading && (
                <div className="empty-state">No data found for this state</div>
            )}
        </section>
    );
};

export default StateDirectory;
