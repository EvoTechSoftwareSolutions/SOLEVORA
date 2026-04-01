import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MdOutlineShoppingBag, MdPendingActions, MdCheckCircle, MdVisibility, MdLocalShipping, MdChevronLeft, MdChevronRight } from "react-icons/md";

const PAGE_SIZE = 10;

const MyOrders = () => {
    const [subTab, setSubTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const fetchOrders = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }
        try {
            const encodedEmail = encodeURIComponent(user.email.trim());
            const response = await axios.get(`http://localhost:5000/api/orders/search?email=${encodedEmail}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user?.email]);

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
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20">
            
            {/* Header */}
            <header>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">TRANSACTION <span className="text-primary italic">LOGS</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Magnitude Procurement History • Blockchain Verified</p>
            </header>

            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Cumulative', value: orders.length, icon: <MdOutlineShoppingBag />, color: 'bg-primary text-white shadow-primary/20' },
                    { label: 'In-Protocol', value: orders.filter(o => o.status === 'pending').length, icon: <MdPendingActions />, color: 'bg-secondary text-white shadow-secondary/20' },
                    { label: 'Finalized', value: orders.filter(o => o.status === 'delivered').length, icon: <MdCheckCircle />, color: 'bg-emerald-500 text-white shadow-emerald-500/20' },
                ].map((metric, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group ${metric.color}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-[.25em] opacity-60">{metric.label}</span>
                            <span className="text-3xl font-black italic">{metric.value} <span className="text-xs uppercase not-italic opacity-40">Units</span></span>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">{metric.icon}</div>
                    </div>
                ))}
            </section>

            {/* Controls */}
            <section className="flex flex-col gap-6">
                <div className="bg-slate-50 p-1.5 rounded-[1.5rem] flex gap-1 overflow-x-auto scrollbar-none italic border border-slate-100/50">
                    {['All Orders', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSubTab(tab)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${subTab === tab ? 'bg-white text-secondary shadow-sm scale-105' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse italic">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/30 font-black text-[9px] text-gray-400 uppercase tracking-widest">
                                    <th className="py-6 px-8">Order ID</th>
                                    <th className="py-6 px-8">Magnitude Manifest</th>
                                    <th className="py-6 px-8 text-center">Value</th>
                                    <th className="py-6 px-8 text-center">Status</th>
                                    <th className="py-6 px-8 text-right">Timestamp</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-300 uppercase tracking-widest">Synchronizing Logs...</td></tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr><td colSpan="6" className="py-20 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Data Packets Found in this Vector</td></tr>
                                ) : paginatedOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-6 px-8">
                                            <span className="text-xs font-black text-secondary group-hover:text-primary transition-colors">#ORD-{order.id.toString().slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            {order.items && order.items.length > 0 ? (
                                                <div className="flex -space-x-4">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm ring-1 ring-black/5">
                                                            <img src={item.product?.image_url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-[8px] font-black shadow-sm ring-1 ring-black/5">+{order.items.length - 3}</div>
                                                    )}
                                                </div>
                                            ) : <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Null Contents</span>}
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <span className="text-xs font-black text-secondary">${parseFloat(order.total_amount).toFixed(2)}</span>
                                        </td>
                                        <td className="py-6 px-8 text-center text-[8px]">
                                            <span className={`inline-block px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                                                order.status === 'cancelled' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right text-[10px] font-bold text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="w-8 h-8 rounded-lg bg-slate-50 text-gray-400 hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-90"><MdVisibility /></button>
                                                <button className="w-8 h-8 rounded-lg bg-slate-50 text-gray-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center active:scale-90"><MdLocalShipping /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-8 italic">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Showing Log Range {rangeStart}–{rangeEnd} of {totalFiltered}</span>
                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <button 
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:text-primary transition-all disabled:opacity-30 disabled:scale-95"
                            >
                                <MdChevronLeft size={24} />
                            </button>
                            <span className="text-[10px] font-black text-secondary px-4">BATCH {page} / {totalPages}</span>
                            <button 
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:text-primary transition-all disabled:opacity-30 disabled:scale-95"
                            >
                                <MdChevronRight size={24} />
                            </button>
                        </div>
                    </footer>
                )}
            </section>

        </div>
    );
};

export default MyOrders;
