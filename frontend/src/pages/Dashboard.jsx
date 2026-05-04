import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiMap, FiMapPin, FiTruck, FiBox } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPincodes: 0,
    totalStates: 0,
    deliveryBreakdown: [],
    stateDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [generalRes, deliveryRes, stateRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/stats/delivery-distribution'),
          axios.get('/api/stats/state-distribution')
        ]);

        const formatDelivery = [
          { name: 'Delivery', value: deliveryRes.data.delivery || 0 },
          { name: 'Non-Delivery', value: deliveryRes.data.nonDelivery || 0 }
        ];

        const formatState = stateRes.data.slice(0, 10);

        setStats({
          totalPincodes: generalRes.data.totalPincodes,
          totalStates: generalRes.data.totalStates,
          deliveryBreakdown: formatDelivery.length ? formatDelivery : [
            { name: 'Delivery', value: 14000 },
            { name: 'Non-Delivery', value: 5300 },
          ],
          stateDistribution: formatState.length ? formatState : [
            { state: 'Maharashtra', count: 1800 },
            { state: 'Uttar Pradesh', count: 1650 },
            { state: 'Tamil Nadu', count: 1500 },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#2563EB', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const deliveryOffices = stats.deliveryBreakdown.find(d => d.name === 'Delivery')?.value || 0;
  const nonDeliveryOffices = stats.deliveryBreakdown.find(d => d.name === 'Non-Delivery')?.value || 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Overview of the Indian Postal Network</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Pincodes', value: stats.totalPincodes.toLocaleString(), icon: <FiMapPin />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' },
          { title: 'States & UTs', value: stats.totalStates, icon: <FiMap />, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-500/10' },
          { title: 'Delivery Offices', value: deliveryOffices.toLocaleString(), icon: <FiTruck />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
          { title: 'Non-Delivery Offices', value: nonDeliveryOffices.toLocaleString(), icon: <FiBox />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10' },
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-6">Delivery Type Distribution</h3>
          <div className="w-full min-h-[256px]" style={{ height: 256 }}>
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={stats.deliveryBreakdown}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.deliveryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tw-prose-invert-bg, #0F172A)', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats.deliveryBreakdown.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-6">Top States by Office Count</h3>
          <div className="w-full min-h-[256px]" style={{ height: 256 }}>
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={stats.stateDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="state" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#1E293B', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {stats.stateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
