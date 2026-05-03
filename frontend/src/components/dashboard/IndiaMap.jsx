import React, { useState, useEffect, useRef } from 'react';

// Simple Mercator projection tuned for India
// India bounds: lon 68-97°E, lat 8-37°N
function projectPoint(lon, lat, width, height) {
    const lonMin = 67.5, lonMax = 97.5;
    const latMin = 7.5, latMax = 37.5;
    const x = ((lon - lonMin) / (lonMax - lonMin)) * width;
    const y = height - ((lat - latMin) / (latMax - latMin)) * height;
    return [x, y];
}

function ringToPath(ring, w, h) {
    return ring.map((pt, i) => {
        const [x, y] = projectPoint(pt[0], pt[1], w, h);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ') + ' Z';
}

function geoToPath(geometry, w, h) {
    if (!geometry) return '';
    const rings = geometry.type === 'Polygon'
        ? geometry.coordinates
        : geometry.coordinates.flat();
    return rings.map(ring => ringToPath(ring, w, h)).join(' ');
}

function getColor(count) {
    if (count >= 1200) return '#1D4ED8';
    if (count >= 900)  return '#2563EB';
    if (count >= 600)  return '#3B82F6';
    if (count >= 300)  return '#93C5FD';
    if (count > 0)     return '#BFDBFE';
    return '#EFF6FF';
}

// Normalize state names from API responses to match GeoJSON property names
function normalizeStateName(name = '') {
    if (!name || typeof name !== 'string') return '';
    return name.toLowerCase()
        .trim()
        .replace(/&/g, ' and ')
        .replace(/\s+and\s+/g, ' ') // treat 'and' as a space for matching
        .replace(/islands?/g, '')   // remove 'islands' suffix
        .replace(/[^a-z0-9]/g, '')  // remove all non-alphanumeric (compact match)
        .trim();
}

const LEGEND = [
    ['#EFF6FF', '0–300'],
    ['#BFDBFE', '300–600'],
    ['#93C5FD', '600–900'],
    ['#3B82F6', '900–1200'],
    ['#1D4ED8', '1200+'],
];

export default function IndiaMap({ distribution = [] }) {
    const [geoData, setGeoData] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const svgRef = useRef(null);

    const W = 500, H = 580;

    useEffect(() => {
        const urls = [
            'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson',
            'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States',
        ];

        const tryFetch = async (urlIndex = 0) => {
            if (urlIndex >= urls.length) {
                setError('Could not load map data.');
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(urls[urlIndex]);
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setGeoData(data);
                setLoading(false);
            } catch {
                tryFetch(urlIndex + 1);
            }
        };
        tryFetch();
    }, []);

    // Build count lookup: normalized state name → count
    const countMap = {};
    distribution.forEach(d => {
        if (d.state) countMap[normalizeStateName(d.state)] = d.count;
    });

    const getCount = (feature) => {
        const props = feature.properties || {};
        const candidates = [
            props.NAME_1, props.ST_NM, props.state, props.name,
            props.NAME_EN, props.shapeName, props.STNAME,
        ];
        for (const name of candidates) {
            if (!name) continue;
            const count = countMap[normalizeStateName(name)];
            if (count !== undefined) return { name, count };
        }
        return { name: candidates.find(Boolean) || 'Unknown', count: 0 };
    };

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8, color: '#94A3B8' }}>
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Map unavailable</p>
            </div>
        );
    }

    if (loading || !geoData) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12, color: '#94A3B8' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#0EA5E9', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Loading map…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const features = geoData.features || [];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {features.map((feature, i) => {
                    const { name, count } = getCount(feature);
                    const d = geoToPath(feature.geometry, W, H);
                    if (!d) return null;
                    return (
                        <path
                            key={i}
                            d={d}
                            fill={getColor(count)}
                            stroke="#FFFFFF"
                            strokeWidth={0.8}
                            style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.setAttribute('fill', '#1E40AF');
                                const rect = svgRef.current?.getBoundingClientRect();
                                setTooltip({ name, count, x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0) });
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.setAttribute('fill', getColor(count));
                                setTooltip(null);
                            }}
                        />
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tooltip && (
                <div style={{
                    position: 'absolute',
                    left: tooltip.x + 12,
                    top: tooltip.y - 44,
                    background: 'rgba(15,23,42,0.92)',
                    color: '#F8FAFC',
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    pointerEvents: 'none',
                    zIndex: 100,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(6px)',
                }}>
                    {tooltip.name}
                    <span style={{ color: '#60A5FA', marginLeft: 8 }}>
                        {tooltip.count.toLocaleString()} pincodes
                    </span>
                </div>
            )}

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                background: 'rgba(255,255,255,0.88)',
                padding: '7px 12px',
                borderRadius: 10,
                fontSize: '0.68rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                {LEGEND.map(([color, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 11, height: 11, background: color, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }} />
                        <span style={{ color: '#475569' }}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
