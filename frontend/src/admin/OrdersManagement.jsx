import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    HiOutlineShoppingBag, 
    HiOutlineClipboardList, 
    HiOutlineCheckCircle, 
    HiOutlineTrash, 
    HiOutlineEye, 
    HiOutlineFilter,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from "react-icons/hi";

const PAGE_SIZE = 10;

const OrdersManagement = () => {
    const [subTab, setSubTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Procurement log synchronization failure:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this procurement log from the network memory?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/orders/${id}`);
            fetchOrders();
        } catch (error) {
            console.error('Log erasure failure:', error);
        }
    };

    const filteredOrders = useMemo(() => orders.filter(order => {
        if (subTab === 'All Orders') return true;
        return order.status.toLowerCase() === subTab.toLowerCase();
    }), [orders, subTab]);

    useEffect(() => {
        setPage(1);
    }, [subTab]);

    const totalFiltered = filteredOrders.length;
    const totalPages = totalFiltered === 0 ? 0 : Math.ceil(totalFiltered / PAGE_SIZE);

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredOrders.slice(start, start + PAGE_SIZE);
    }, [filteredOrders, page]);

    const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = totalFiltered === 0 ? 0 : Math.min(page * PAGE_SIZE, totalFiltered);

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">ORDER <span className="text-primary italic">PROTOCOL</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Magnitude Distribution Log • Blockchain Synchronized</p>
                </div>
            </header>

            {/* Global Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Cumulative Volume', value: orders.length, icon: <HiOutlineShoppingBag />, color: 'bg-primary text-white shadow-primary/20' },
                    { label: 'In-Transit / Pending', value: orders.filter(o => o.status === 'pending').length, icon: <HiOutlineClipboardList />, color: 'bg-secondary text-white shadow-secondary/20' },
                    { label: 'Finalized Delivery', value: orders.filter(o => o.status === 'delivered').length, icon: <HiOutlineCheckCircle />, color: 'bg-emerald-500 text-white shadow-emerald-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group ${stat.color}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-[.25em] opacity-60">{stat.label}</span>
                            <span className="text-3xl font-black italic">{stat.value}</span>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    </div>
                ))}
            </section>

            {/* Log Controls */}
            <section className="flex flex-col gap-6">
                <div className="bg-white p-1.5 rounded-[1.5rem] flex flex-wrap gap-1 border border-slate-100 shadow-sm">
                    {['All Orders', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSubTab(tab)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === tab ? 'bg-secondary text-white shadow-lg shadow-secondary/10 scale-105' : 'text-gray-400 hover:text-secondary hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Data Grid */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-4 text-gray-400">
                             <HiOutlineFilter className="hover:text-primary cursor-pointer transition-colors" size={20} />
                             <span className="text-[9px] font-black uppercase tracking-widest">{totalFiltered} Signals Found</span>
                         </div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Live Propagation Feed</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left italic border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="py-6 px-8">Signal Index</th>
                                    <th className="py-6 px-8">Personnel Endpoint</th>
                                    <th className="py-6 px-8 text-center">Magnitude Value</th>
                                    <th className="py-6 px-8 text-center">Transmission Status</th>
                                    <th className="py-6 px-8 text-right">Timestamp</th>
                                    <th className="py-6 px-8 text-right">Overrides</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-300 uppercase tracking-widest">Intercepting Data Packets...</td></tr>
                                ) : paginatedOrders.length === 0 ? (
                                    <tr><td colSpan="6" className="py-20 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Procurements Detected in this Vector</td></tr>
                                ) : paginatedOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <span className="text-xs font-black text-secondary group-hover:text-primary transition-colors">#ORD-{order.id.toString().slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.email}`} alt="" />
                                                 </div>
                                                 <span className="text-[10px] font-black text-secondary truncate max-w-[150px] uppercase">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <span className="text-xs font-black text-secondary">${parseFloat(order.total_amount).toFixed(2)}</span>
                                        </td>
                                        <td className="py-6 px-8 text-center text-[8px]">
                                             <span className={`inline-block px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                order.status === 'cancelled' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
                                             }`}>{order.status}</span>
                                        </td>
                                        <td className="py-6 px-8 text-right text-[10px] font-bold text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="w-8 h-8 rounded-lg bg-slate-50 text-gray-400 hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-90"><HiOutlineEye /></button>
                                                <button onClick={() => handleDelete(order.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-gray-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-90"><HiOutlineTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20 italic">
                         <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Showing Log Batch {rangeStart}–{rangeEnd} of {totalFiltered}</span>
                         <div className="flex items-center gap-3">
                             <button 
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white transition-all disabled:opacity-30 active:scale-90"
                            >
                                <HiOutlineChevronLeft size={20} />
                            </button>
                             <div className="flex gap-1">
                                <span className="text-[10px] font-black text-secondary px-4 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm italic">PACKET {page} / {totalPages}</span>
                             </div>
                             <button 
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:text-secondary hover:text-white transition-all disabled:opacity-30 active:scale-90"
                            >
                                <HiOutlineChevronRight size={20} />
                            </button>
                         </div>
                    </footer>
                </div>
            </section>

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-50 pb-8 italic">Procurement Distributed Grid v2.6 • SoleVora Network</p>

        </div>
    );
};

export default OrdersManagement;
