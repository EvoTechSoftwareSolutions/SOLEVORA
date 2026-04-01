import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    HiOutlineChartBar, 
    HiOutlineCurrencyDollar, 
    HiOutlineShoppingBag, 
    HiOutlineCube, 
    HiOutlineExclamationCircle,
    HiOutlineTrendingUp,
    HiOutlineTrendingDown,
    HiOutlineLightningBolt
} from "react-icons/hi";

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Business intelligence extraction failure:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6 animate-pulse">
                <HiOutlineChartBar size={64} className="text-primary/20" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">Extracting Network Magnitude intelligence...</h4>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">ANALYTICS <span className="text-primary italic">DEEP-DIVE</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Advanced Business Intelligence • Neural Data Mining</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                        <button key={q} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${i===3 ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105' : 'text-gray-400 hover:text-secondary'}`}>{q} - 2026</button>
                    ))}
                </div>
            </header>

            {/* Core Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Network Yield', value: `$${stats.totalRevenue.toLocaleString()}`, trend: '+18.4%', isUp: true, icon: <HiOutlineCurrencyDollar />, color: 'text-primary bg-primary/10' },
                    { label: 'Signal Volume', value: stats.totalOrders.toLocaleString(), trend: '+5.2%', isUp: true, icon: <HiOutlineShoppingBag />, color: 'text-blue-500 bg-blue-500/10' },
                    { label: 'Catalog Magnitude', value: stats.totalProducts, trend: 'STABLE', isUp: true, icon: <HiOutlineCube />, color: 'text-purple-500 bg-purple-500/10' },
                    { label: 'Critical Errors', value: stats.lowStockItems, trend: '-2.1%', isUp: false, icon: <HiOutlineExclamationCircle />, color: 'text-rose-500 bg-rose-500/10' },
                ].map((m, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-8 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${m.color}`}>{m.icon}</div>
                             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm ${m.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                {m.isUp ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
                                {m.trend}
                             </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
                            <h3 className="text-3xl font-black text-secondary mt-1">{m.value}</h3>
                        </div>
                    </div>
                ))}
            </section>

            {/* Intelligence Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Prediction Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-10 group overflow-hidden relative">
                    <div className="flex justify-between items-center">
                        <div>
                             <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-primary pl-4">Yield Variance Log</h3>
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-5 italic">Projected vs Realized Magnitude Propagation</p>
                        </div>
                        <HiOutlineLightningBolt className="text-primary animate-pulse" size={24} />
                    </div>
                    <div className="w-full h-80 relative flex items-end justify-between px-4 pb-10">
                        {/* Mock Bar Chart */}
                        {[85, 45, 65, 95, 35, 75, 55, 80, 40, 60, 90, 100].map((h, i) => (
                            <div key={i} className="w-4 bg-slate-50 rounded-full relative group/bar hover:bg-primary/10 transition-all cursor-crosshair">
                                <div 
                                    className="absolute bottom-0 left-0 w-full bg-secondary rounded-full group-hover/bar:bg-primary transition-all duration-1000 ease-out flex items-center justify-center pt-2" 
                                    style={{ height: `${h}%` }}
                                >
                                    <span className="text-[6px] font-black text-white transform rotate-90 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">{h}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center px-4 -mt-6">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">January</span>
                        <div className="h-px bg-slate-100 flex-1 mx-10" />
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">December</span>
                    </div>
                </div>

                {/* Growth Distribution */}
                <div className="bg-black p-10 rounded-[3rem] text-white flex flex-col gap-10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                     <div className="flex-1 flex flex-col justify-center gap-12 relative z-10">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white italic italic">Network Expansion <span className="text-primary italic">Status</span></h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Global node synchronization coverage: 84%</p>
                        </div>
                        <div className="flex flex-col gap-8">
                             {[
                                { label: 'Internal Sector Retention', value: 92, color: 'bg-primary' },
                                { label: 'New Node Acquisition', value: 64, color: 'bg-emerald-500' },
                                { label: 'Supply Chain Efficiency', value: 78, color: 'bg-blue-500' },
                             ].map((p, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                         <span className="text-gray-400">{p.label}</span>
                                         <span className="text-white">{p.value}%</span>
                                     </div>
                                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                         <div className={`h-full rounded-full transition-all duration-[2s] group-hover:opacity-80 ${p.color}`} style={{ width: `${p.value}%` }} />
                                     </div>
                                </div>
                             ))}
                        </div>
                     </div>
                     <button className="h-14 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 italic">Generate PDF intelligence Spec</button>
                </div>

            </section>

            <footer className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-40 pb-12 italic border-t border-slate-100 pt-10">
                Solevora Business Intelligence v2.6.4 • Enterprise Data Mining Enabled
            </footer>

        </div>
    );
};

export default Analytics;
