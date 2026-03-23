import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const ProfileLayout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-50">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="SoleVoro Logo" className="h-10 w-auto dark:invert" />
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary">Home</Link>
                    <Link to="/category" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary">Category</Link>
                    <Link to="/about" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary">About</Link>
                    <Link to="/contact" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary">Contact</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <button className="text-slate-600 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined text-[26px]">shopping_cart</span>
                    </button>
                    <button className="text-slate-600 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined text-[26px]">person</span>
                    </button>
                    <button className="text-slate-600 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined text-[26px]">favorite</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col fixed h-[calc(100vh-80px)] top-20 overflow-y-auto">
                    <div className="p-8">
                        {/* Profile Section */}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="relative">
                                <div className="size-16 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZwRIB9E2bVLjx2kVia-eDWU4btLpIpUV64ODyiXAE6uhnqHH3CyAk64bsF9R1SdiAa4dJkpn6m9XLr8X_dz4fBCKkdY0DLuCpqzXMRTER2GFJclsl_g4avvEvYCE-PtIMUGcM2aoWD6TfdIrtq1Z34_HdT4PX5Vg_H2o10EnHxlCmDJT9p6uyxEHXjFM8EYQTRRFBUQsMPQhTgXYx_7Dd3MHTpELJb11V8EqaN3Pl1j4lmlCJzbvfQrGcwdDyg5Ww660JxTgyr70" alt="Marcus Sterling" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white size-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                    <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-lg">Marcus Sterling</h4>
                                <p className="text-[10px] font-black text-primary uppercase tracking-wider">Gold Member</p>
                            </div>
                        </div>

                        {/* Sidebar Links */}
                        <nav className="space-y-4 mb-12">
                            <Link to="/profile/dashboard" className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${location.pathname === '/profile/dashboard' ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
                                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/profile/dashboard' ? 'font-bold' : ''}`}>grid_view</span>
                                <span className="text-[13px] font-semibold">Dashboard</span>
                            </Link>

                            <Link to="/profile/orders" className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${location.pathname === '/profile/orders' ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
                                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/profile/orders' ? 'font-bold' : ''}`}>shopping_bag</span>
                                <span className="text-[13px] font-semibold">My Orders</span>
                            </Link>

                            <Link to="/profile/wishlist" className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${location.pathname === '/profile/wishlist' ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30 active-link' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
                                <span className="material-symbols-outlined text-[20px]">favorite</span>
                                <span className="text-[13px] font-semibold">Wishlist</span>
                            </Link>

                            <Link to="/profile/account" className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${location.pathname === '/profile/account' ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
                                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/profile/account' ? 'font-bold' : ''}`}>settings_applications</span>
                                <span className="text-[13px] font-semibold">Account Settings</span>
                            </Link>

                            <Link to="/profile/addresses" className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${location.pathname === '/profile/addresses' ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
                                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/profile/addresses' ? 'font-bold' : ''}`}>location_on</span>
                                <span className="text-[13px] font-semibold">Addresses</span>
                            </Link>
                        </nav>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8">
                            <Link to="/logout" className="flex items-center gap-4 px-3 py-3 text-red-500 hover:text-red-600 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="text-[13px] font-bold">Logout</span>
                            </Link>
                        </div>
                    </div>

                    {/* Exclusive Offer Card */}
                    <div className="mt-auto px-6 pb-10">
                        <div className="bg-[#0c121e] rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-6xl">local_offer</span>
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-[#ff6d2e] uppercase mb-1">Exclusive Offer</p>
                            <h5 className="text-white font-bold text-lg mb-2">20% Off New Releases</h5>
                            <p className="text-[10px] text-slate-400 mb-6">Use code <span className="text-white font-bold">SOLEVORA20</span> at checkout.</p>
                            <button className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Shop Now</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 ml-72">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
