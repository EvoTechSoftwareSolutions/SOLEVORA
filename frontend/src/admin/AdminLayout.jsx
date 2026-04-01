import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAdminAuth } from '../context/AdminAuthContext';
import { HiOutlineSearch, HiOutlineBell, HiOutlineChatAlt2 } from "react-icons/hi";

const AdminLayout = () => {
    const { adminUser, roleName } = useAdminAuth();

    const initials = adminUser?.name
        ? adminUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AD';

    return (
        <div className="flex h-screen bg-slate-50 font-manrope selection:bg-primary/20 overflow-hidden italic">
            
            {/* Immersive Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Master Command Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 pl-20 pr-6 md:px-10 flex items-center justify-between shrink-0 z-50">
                    
                    <div className="flex-1 max-w-xl group">
                        <div className="relative flex items-center">
                            <HiOutlineSearch className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="EXECUTE SEARCH..." 
                                className="w-full h-11 pl-12 pr-6 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-black text-xs uppercase tracking-widest italic"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-10">
                        <div className="hidden md:flex items-center gap-2">
                            <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-gray-400 hover:bg-slate-100 hover:text-secondary transition-all relative">
                                <HiOutlineBell size={22} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
                            </button>
                            <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-gray-400 hover:bg-slate-100 hover:text-secondary transition-all">
                                <HiOutlineChatAlt2 size={22} />
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-100 hidden md:block" />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-tighter text-secondary leading-none">{adminUser?.name || 'Admin'}</p>
                                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1 opacity-60">{roleName || 'Operator'}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-secondary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-black/10 ring-2 ring-white overflow-hidden">
                                {adminUser?.name ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser.name}`} alt="" /> : initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub-Command Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-[1600px] mx-auto">
                         <Outlet />
                    </div>
                    
                    <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
                         <span className="text-[9px] font-black uppercase tracking-[.3em] text-gray-400">SOLE VORA INTELLECTUAL PROPERTY © 2026</span>
                         <div className="flex gap-6 italic">
                             <span className="text-[9px] font-black uppercase tracking-widest">Network Status: Nominal</span>
                             <span className="text-[9px] font-black uppercase tracking-widest">Secure Node: SEA-01</span>
                         </div>
                    </footer>
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;
