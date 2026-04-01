import React, { useEffect, useState, useMemo } from 'react';
import { MdGridView, MdLogout, MdOutlineShoppingBag, MdFavoriteBorder, MdOutlineSettings, MdOutlineLocationOn } from "react-icons/md";
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const ProfileLayout = () => {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const displayName = useMemo(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr).name;
        } catch (_) { /* ignore */ }
        return 'Valued Customer';
    }, [location.pathname]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen]);

    const navLinks = [
        { name: 'Dashboard', path: '/profile/dashboard', icon: <MdGridView size={20} /> },
        { name: 'My Orders', path: '/profile/orders', icon: <MdOutlineShoppingBag size={20} /> },
        { name: 'Wishlist', path: '/profile/wishlist', icon: <MdFavoriteBorder size={20} /> },
        { name: 'Account Settings', path: '/profile/account', icon: <MdOutlineSettings size={20} /> },
        { name: 'Addresses', path: '/profile/addresses', icon: <MdOutlineLocationOn size={20} /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-manrope selection:bg-primary/20">
            <Navbar />
            
            <div className="flex-1 flex flex-col lg:flex-row pt-20 lg:pt-24 max-w-[1440px] mx-auto w-full px-6 md:px-12 gap-8 pb-20">
                
                {/* Mobile Top Bar */}
                <header className="lg:hidden flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-black/5 animate-fadeIn">
                    <button
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-secondary active:scale-90 transition-transform"
                    >
                        <span className="material-symbols-outlined">{drawerOpen ? 'close' : 'menu'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-secondary">{displayName}</p>
                            <p className="text-[8px] font-bold text-primary uppercase tracking-[.2em]">Gold Tier</p>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-primary/20">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Avatar" />
                        </div>
                    </div>
                </header>

                {/* Sidebar Overlay */}
                {drawerOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] lg:hidden animate-fadeIn"
                        onClick={() => setDrawerOpen(false)}
                    />
                )}

                {/* Sidebar Drawer */}
                <aside className={`fixed lg:static inset-y-0 left-0 w-80 lg:w-72 bg-white lg:bg-transparent z-[1200] lg:z-auto transition-all duration-500 transform lg:translate-x-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col gap-8`}>
                    
                    {/* User Profile Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5 hidden lg:flex flex-col items-center text-center animate-fadeIn">
                         <div className="relative mb-4 group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-primary/10 group-hover:scale-105 transition-transform duration-500">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Avatar" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-emerald-100">
                                <span className="material-symbols-outlined text-xs font-black">verified</span>
                            </div>
                         </div>
                         <h4 className="text-sm font-black uppercase tracking-tighter text-secondary">{displayName}</h4>
                         <p className="text-[9px] font-bold text-primary uppercase tracking-[.3em] mt-1 italic">Vora Elite Member</p>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 bg-white lg:bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col gap-2 overflow-y-auto italic">
                        <div className="lg:hidden flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[.3em] text-primary">Magnitude Access</h3>
                            <button onClick={() => setDrawerOpen(false)} className="text-secondary"><span className="material-symbols-outlined">close</span></button>
                        </div>

                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-gray-400 hover:bg-slate-50 hover:text-secondary'}`}
                                >
                                    <span className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{link.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{link.name}</span>
                                    {isActive && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                </Link>
                            );
                        })}

                        <div className="mt-auto pt-8">
                             <Link 
                                to="/logout"
                                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-400 hover:bg-rose-50 transition-all group uppercase"
                             >
                                <MdLogout size={20} className="group-hover:text-rose-600" />
                                <span className="text-[10px] font-black tracking-widest group-hover:text-rose-600">Terminate Protocol</span>
                             </Link>
                        </div>
                    </nav>

                    {/* Offer Card */}
                    <div className="bg-secondary p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-secondary/20 animate-fadeIn">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-primary text-[8px] font-black uppercase tracking-[.2em] rounded-lg mb-4">Elite Drops</span>
                            <h5 className="text-lg font-black uppercase italic tracking-tighter leading-none mb-2">20% MAGNITUDE <br /><span className="text-primary">REDUCTION</span></h5>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-6">USE CODE: <span className="text-white">SOLEVORA20</span></p>
                            <Link to="/category" className="w-full h-10 bg-white text-secondary rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95 italic">Access Now</Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-[3rem] shadow-sm border border-black/5 p-8 md:p-12 animate-fadeIn relative">
                    <div className="absolute top-10 right-10 opacity-[.03] select-none pointer-events-none hidden md:block">
                        <span className="text-[15rem] font-black uppercase italic leading-none tracking-tighter">VORA</span>
                    </div>
                    <Outlet />
                </main>

            </div>

            <Footer />
        </div>
    );
};

export default ProfileLayout;
