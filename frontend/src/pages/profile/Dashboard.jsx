import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineShoppingBag, MdFavoriteBorder, MdOutlineStars, MdTrendingUp, MdOutlineAccountCircle, MdOutlineShield, MdOutlineLocalPostOffice } from "react-icons/md";

const Dashboard = () => {
    // Mock data for high-fidelity demonstration
    const stats = [
        { label: 'Total Magnitude', value: '12 Orders', change: '+2 this month', icon: <MdOutlineShoppingBag />, color: 'text-primary' },
        { label: 'Curated Wishlist', value: '48 Items', change: '+5 new drops', icon: <MdFavoriteBorder />, color: 'text-rose-500' },
        { label: 'Elite Tier', value: 'Gold Member', change: '850 Points', icon: <MdOutlineStars />, color: 'text-brand-gold' },
    ];

    const recentOrders = [
        { id: '#SV-9912', name: 'Nike Jordan Retro 1', date: 'Oct 12, 2026', price: '$190', status: 'In Transit', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
        { id: '#SV-8845', name: 'Adidas Yeezy Boost', date: 'Sep 28, 2026', price: '$220', status: 'Delivered', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
    ];

    return (
        <div className="flex flex-col gap-12 relative z-10 animate-fadeIn">
            
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">COMMAND <span className="text-primary italic">CENTER</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Operational Overview • System Synchronized</p>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 group">
                    <MdTrendingUp className="text-lg group-hover:scale-125 transition-transform" />
                    Upgrade to Platinum
                </button>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-4 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className={`absolute top-4 right-4 text-4xl opacity-5 group-hover:opacity-20 group-hover:-translate-y-2 transition-all ${stat.color}`}>
                             {stat.icon}
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        <h3 className="text-2xl font-black text-secondary leading-tight italic">{stat.value}</h3>
                        <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-tighter ${stat.color}`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Middle Row */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                
                {/* Recent Orders Mini-Feed */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-primary pl-4 italic">Recent Activity</h3>
                         <Link to="/profile/orders" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 decoration-2">Full History</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        {recentOrders.map((order, i) => (
                            <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-white border border-slate-50 hover:border-primary/20 group transition-all">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                    <img src={order.img} alt={order.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black uppercase tracking-tight text-secondary truncate">{order.name}</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.id} • {order.date}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-secondary">{order.price}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mt-2 ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wishlist Spotlight */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-rose-500 pl-4 italic">Wishlist Spotlight</h3>
                         <Link to="/profile/wishlist" className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:underline underline-offset-4 decoration-2">Entire Wishlist</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group relative">
                                <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                                     <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Spotlight" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex justify-between items-center italic">
                                     <h4 className="text-[10px] font-black uppercase tracking-tighter text-secondary">AIR JORDAN MAX</h4>
                                     <span className="text-rose-500 font-black text-xs">$240</span>
                                </div>
                                <button className="absolute top-8 right-8 text-rose-400 hover:text-rose-600 transition-colors">
                                     <MdFavoriteBorder size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Account Overview Cards */}
            <section className="flex flex-col gap-8">
                 <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-secondary pl-4 italic">Account Architecture</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Identity Matrix', value: 'Personal Intelligence', icon: <MdOutlineAccountCircle />, link: '/profile/account' },
                        { label: 'Security Layer', value: 'Encryption v2.6', icon: <MdOutlineShield />, link: '/profile/account' },
                        { label: 'Logistics Hub', value: '4 Active Endpoints', icon: <MdOutlineLocalPostOffice />, link: '/profile/addresses' },
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:translate-y-[-4px] hover:shadow-xl transition-all duration-500">
                             <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                     {card.icon}
                                </div>
                                <Link to={card.link} className="text-[9px] font-black uppercase tracking-[.2em] text-primary hover:underline italic">Refactor</Link>
                             </div>
                             <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                                <p className="text-sm font-black text-secondary italic tracking-tight">{card.value}</p>
                             </div>
                        </div>
                    ))}
                 </div>
            </section>

        </div>
    );
};

export default Dashboard;