import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DeliveryPieChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 180, minHeight: 180, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {data.length > 0 ? `${((data[0].value / (data[0].value + data[1].value)) * 100).toFixed(1)}%` : '0%'}
                </p>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>delivery</p>
            </div>
        </div>
    );
};

export default DeliveryPieChart;
