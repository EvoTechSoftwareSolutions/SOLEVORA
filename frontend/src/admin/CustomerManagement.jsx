import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    HiOutlineUsers, 
    HiOutlineUserAdd, 
    HiOutlineStatusOnline, 
    HiOutlineSearch, 
    HiOutlineTrash, 
    HiOutlineMail,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineExternalLink
} from "react-icons/hi";

const PAGE_SIZE = 10;

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/admin/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Personnel database synchronization failure:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate this personnel record from the magnitude network?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Record termination failure:', error);
        }
    };

    const filteredCustomers = useMemo(() => customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [customers, searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const totalFiltered = filteredCustomers.length;
    const totalPages = totalFiltered === 0 ? 0 : Math.ceil(totalFiltered / PAGE_SIZE);

    const paginatedCustomers = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCustomers.slice(start, start + PAGE_SIZE);
    }, [filteredCustomers, page]);

    const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = totalFiltered === 0 ? 0 : Math.min(page * PAGE_SIZE, totalFiltered);

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">PERSONNEL <span className="text-primary italic">INTELLIGENCE</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Identity Management Grid • Global Node Mapping</p>
                </div>
            </header>

            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Network Reach', value: customers.length, desc: 'Registered Personnel' },
                    { label: 'Vector Growth', value: '12%', desc: 'Active Acquisition' },
                    { label: 'Direct Comm-Link', value: 'Enabled', desc: 'Secure Neural Connect' },
                ].map((m, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                         <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-[.25em] text-gray-400">{m.label}</span>
                            <span className="text-3xl font-black text-secondary">{m.value}</span>
                            <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1 opacity-60 italic">{m.desc}</span>
                         </div>
                    </div>
                ))}
            </section>

            {/* Table Area */}
            <section className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="relative flex-1 max-w-md group w-full">
                        <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors text-xl" />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY IDENTITY OR ENDPOINT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 pl-14 pr-6 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-black text-[10px] uppercase tracking-widest italic"
                        />
                    </div>
                    <div className="flex gap-2">
                         <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm active:scale-95"><HiOutlineUserAdd size={24} /></button>
                         <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all shadow-sm active:scale-95"><HiOutlineStatusOnline size={24} /></button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left italic border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="py-6 px-8">Identity Matrix</th>
                                    <th className="py-6 px-8">Neural Endpoint (Email)</th>
                                    <th className="py-6 px-8 text-center">Activation Timestamp</th>
                                    <th className="py-6 px-8 text-right">Overrides</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-300 uppercase tracking-widest">Intercepting Identity Packets...</td></tr>
                                ) : paginatedCustomers.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Personnel Detected in this Intelligence Vector</td></tr>
                                ) : paginatedCustomers.map((cust) => (
                                    <tr key={cust.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                 <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden bg-slate-100 shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cust.name}`} alt="" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                    <h4 className="text-xs font-black uppercase tracking-tighter text-secondary leading-tight truncate max-w-[150px]">{cust.name}</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status: Active</p>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineMail className="text-gray-300" />
                                                <span className="text-[10px] font-black text-secondary lowercase tracking-tight">{cust.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center text-[10px] font-bold text-gray-400">
                                            {new Date(cust.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="w-9 h-9 rounded-xl bg-slate-50 text-gray-400 hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-90"><HiOutlineExternalLink /></button>
                                                <button onClick={() => handleDelete(cust.id)} className="w-9 h-9 rounded-xl bg-slate-50 text-gray-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-90"><HiOutlineTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20 italic">
                         <span className="text-[9px] font-black text-gray-300 uppercase tracking-[.3em]">Showing Personnel Log {rangeStart}–{rangeEnd} of {totalFiltered}</span>
                         <div className="flex items-center gap-3">
                             <button 
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white transition-all disabled:opacity-30 active:scale-90"
                            >
                                <HiOutlineChevronLeft size={20} />
                            </button>
                             <div className="flex gap-1">
                                <span className="text-[10px] font-black text-secondary px-4 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm italic">VECTOR {page} / {totalPages}</span>
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

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-50 pb-8 italic">Personnel Data Management v2.6 • SoleVora Network</p>

        </div>
    );
};

export default CustomerManagement;
