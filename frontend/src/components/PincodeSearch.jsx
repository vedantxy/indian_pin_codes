import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PincodeSearch = ({ onSearch, results, loading }) => {
    const [pincode, setPincode] = useState('');

    const handleSearch = () => {
        if (pincode.trim()) {
            onSearch(pincode);
        }
    };

    return (
        <section className="view-container">
            <div className="search-hero">
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Pincode Inquisitor</h2>
                <div className="search-input-group">
                    <input 
                        type="text" 
                        placeholder="e.g. 520001" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Retrieving...' : 'Retrieve Details'}
                    </button>
                </div>
            </div>

            {results && results.length > 0 && (
                <div className="results-container">
                    <div className="results-table-header">
                        <span>OFFICE NAME</span>
                        <span>PINCODE</span>
                        <span>DISTRICT</span>
                        <span>STATE</span>
                        <span>TYPE</span>
                    </div>
                    {results.map((item, index) => (
                        <div key={index} className="results-row">
                            <span className="row-office">{item.officeName}</span>
                            <span>{item.pincode}</span>
                            <span>{item.districtName}</span>
                            <span>{item.stateName}</span>
                            <span>{item.officeType || 'N/A'}</span>
                        </div>
                    ))}
                </div>
            )}

            {results && results.length === 0 && !loading && (
                <div className="empty-state">No data found for this pincode</div>
            )}
        </section>
    );
};

export default PincodeSearch;
