import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineLocationOn, MdOutlineAdd, MdOutlineEdit, MdOutlineDeleteOutline, MdOutlineContactSupport, MdOutlineCheckCircle } from "react-icons/md";

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/addresses/${user.email}`);
                setAddresses(response.data);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [user?.email]);

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate this endpoint? This action is irreversible.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/addresses/${id}`);
            setAddresses(addresses.filter((addr) => addr.id !== id));
        } catch (error) {
            console.error("Deletion protocol failure:", error);
        }
    };

    return (
        <div className="flex flex-col gap-12 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">LOGISTICS <span className="text-primary italic">HUB</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Active Endpoints • Delivery Vector Optimization</p>
                </div>
                <Link 
                    to="/profile/addresses/add" 
                    className="flex items-center gap-3 px-8 h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 active:scale-95 group shrink-0"
                >
                    <MdOutlineAdd size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    Establish New Endpoint
                </Link>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-[10px] font-bold text-gray-300 uppercase tracking-widest">Scanning Network for active coordinates...</div>
                ) : (
                    <>
                        {addresses.map((addr) => (
                            <div key={addr.id} className={`bg-white rounded-[2.5rem] border p-2 shadow-sm transition-all duration-500 group relative flex flex-col ${addr.isDefault ? 'border-primary/30 ring-4 ring-primary/5' : 'border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2'}`}>
                                
                                {addr.isDefault && (
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest z-10 border border-emerald-100">
                                        <MdOutlineCheckCircle size={12} />
                                        Primary Vector
                                    </div>
                                )}

                                <div className="p-8 flex flex-col gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm shrink-0">
                                            <MdOutlineLocationOn size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                             <h4 className="text-sm font-black uppercase tracking-widest text-secondary truncate">{addr.type || 'Standard Node'}</h4>
                                             <div className="mt-4 flex flex-col gap-1">
                                                <p className="text-xs font-black text-secondary uppercase tracking-tight">{addr.fullName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">{addr.streetAddress}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">{addr.city}, {addr.state} {addr.zipCode}</p>
                                             </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                         <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">COMMS:</span>
                                         <span className="text-[10px] font-black text-secondary tracking-widest">{addr.phoneNumber}</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50/50 rounded-b-[2rem] flex items-center justify-between gap-4 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <Link to={`/profile/addresses/edit/${addr.id}`} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm active:scale-90"><MdOutlineEdit size={18} /></Link>
                                        <button onClick={() => handleDelete(addr.id)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm active:scale-90"><MdOutlineDeleteOutline size={18} /></button>
                                    </div>
                                    {!addr.isDefault && (
                                        <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 decoration-2">Set as Primary</button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Placeholder */}
                        <Link to="/profile/addresses/add" className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center gap-6 group hover:bg-white hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm ring-1 ring-black/5">
                                <MdOutlineAdd size={32} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-secondary">Establish Endpoint</h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.2em] mt-2 group-hover:text-gray-500">Inject new delivery coordinates into the network.</p>
                            </div>
                        </Link>
                    </>
                )}
            </div>

            {/* Help Section */}
            <footer className="mt-8 p-8 bg-black rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-black/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <MdOutlineContactSupport size={28} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-black uppercase tracking-widest italic">Technical Logistics Support</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">Encountering coordinate propagation delays? Support is active.</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 h-12 bg-white text-secondary rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 italic">Open Comm-Link</button>
            </footer>

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.3em] opacity-50 pb-8 italic">Global Logistics Grid v2.6 • SoleVora Network</p>

        </div>
    );
};

export default Addresses;
