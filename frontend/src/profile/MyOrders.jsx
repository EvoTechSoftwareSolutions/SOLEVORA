import React, { useState } from 'react';

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState('All Orders');

    const orders = [
        {
            id: 'SV-98234',
            date: 'Oct 24, 2023',
            total: '$189.00',
            shipTo: 'Alex Johnson',
            status: 'Delivered',
            statusStyle: 'text-green-600 bg-green-500/10',
            deliveryDate: 'Delivered on Oct 27, 2023',
            productName: 'Aura Runner Pro Gen-2',
            meta: 'Size: 10.5 | Color: Ember Orange / Cloud White',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGJi7MTzKdY_WjtTKpTbqZpNrZnc4WQo03z38DHiPrLn24M-6bUs62amTIWgDAI-mUJls-VPfuwKInq5U-hfDNgXh2TQQ9WcMg1Q6EA99uNdcoyBodZv8wMPPfwDwePUJhwnGvLq_lm7I4m5DIsb2m5mnuI8_rUCtcb4xpiRjbh127qz6OZ8d2aDtC8Jq0kOtb4xVDhAaZEWFlFdJ1O0Ns-0uHy9GCuhw06nWV9ydBynDC9wBRftNktU_aDN3-G5t3j0tK6HjJ7o",
            actions: ['Buy Again', 'View Product', 'Write Review']
        },
        {
            id: 'SV-99412',
            date: 'Nov 02, 2023',
            total: '$145.00',
            shipTo: 'Alex Johnson',
            status: 'In Transit',
            statusStyle: 'text-blue-600 bg-blue-500/10',
            deliveryDate: 'Estimated Delivery: Tomorrow by 8PM',
            productName: 'Velocit Low-Top',
            meta: 'Size: 11 | Color: Midnight Grey',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxvGV4gmOupOTDj8fRSHKBufD4PBa7HFJVVRcOKBbqvc29j83ZHh3VMvjNeE5xot6RDFsJYTf8RLy6NTtaG1r7p3-4OZru3_0AwNa5hAQnF5P_oZuPNd8e5JoMFoSASxNwzWxzB6-JFAvgiksTU5Zj1slgLMSMRrbhAIOg5425q8YIB19dHIxoNPdJzX5DZVaGDD76k4QVPEVvVEcexWh2-EflYwvJ3iG-I2dHuFiLZf7nGPd9QtwLFyjZNSBWCTRqvXuw-MgTVmU",
            actions: ['Track Order', 'View Details'],
            trackingUpdate: 'Package arrived at local carrier facility in Brooklyn, NY',
            progress: 3
        },
        {
            id: 'SV-97551',
            date: 'Sep 18, 2023',
            total: '$95.00',
            shipTo: 'Alex Johnson',
            status: 'Cancelled',
            statusStyle: 'text-red-500 bg-red-500/10',
            deliveryDate: 'Refunded on Sep 20, 2023',
            productName: 'TrekLite Sandals',
            meta: 'Size: 11 | Color: Onyx Black',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk98AWUIdGzja8qf5R7ohYAVuQ17_jO6ukqJtb5EfFN-tSSKlEEC7dwkRI_H0ALJhS7E5QyqXZmiWPOHdcJEwMBRYw6UXVla3YgC-RJx_DWqw_1ZprRIgJEp6Nz-wP-zbZ_PU34rzCmOJvNPdfjGD0sPCpnnRBDYS892SIwPJupLnvWKCe9Koy70a-4CH-Ds5LWTDrgdDcDM9JwRWV6wTMjD7ryVUu6OVr27dKygETJfPmAGuMLmMhAl0wASHWH8sRpJXzWigz7k0",
            actions: ['Reorder', 'Cancellation Help']
        }
    ];

    const tabs = ['All Orders', 'In Transit', 'Completed', 'Cancelled', 'Processing'];

    return (
        <div className="p-10 bg-background-light dark:bg-background-dark min-h-full font-display">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">My Orders</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your recent purchases and track your active shipments.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">search</span>
                        <input 
                            className="w-full lg:w-80 pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm shadow-sm transition-all outline-none" 
                            placeholder="Find an order..." 
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 border-b border-slate-100 dark:border-slate-800 pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_-2px_8px_rgba(255,109,46,0.3)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-8">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
                        {/* Order Header */}
                        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex flex-wrap gap-10 text-sm">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Order Placed</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-300">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Total</p>
                                    <p className="font-black text-primary">{order.total}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Ship To</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-300 underline cursor-pointer hover:text-primary transition-colors decoration-slate-200">{order.shipTo}</p>
                                </div>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Order # {order.id}</p>
                                <button className="text-xs font-black text-primary hover:underline mt-1 uppercase tracking-tighter">View Invoice</button>
                            </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-8 flex flex-col md:flex-row gap-8">
                            <div className="size-36 bg-[#f3f4f6] dark:bg-slate-800 rounded-3xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.statusStyle}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">{order.deliveryDate}</span>
                                </div>
                                <h3 className="text-2xl font-extrabold mb-1 text-slate-800 dark:text-white leading-tight">{order.productName}</h3>
                                <p className="text-xs font-bold text-slate-400 mb-8">{order.meta}</p>
                                
                                <div className="flex flex-wrap gap-3">
                                    {order.actions.map((action, idx) => (
                                        <button 
                                            key={idx} 
                                            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${idx === 0 ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'}`}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tracking Update Column */}
                            {order.trackingUpdate && (
                                <div className="md:w-72 pl-8 border-l border-slate-50 dark:border-slate-800 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Last Update</p>
                                    <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-6 leading-relaxed italic">{order.trackingUpdate}</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(step => (
                                            <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step <= (order.progress || 0) ? 'bg-primary shadow-[0_0_8px_rgba(255,109,46,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-3">
                <button className="size-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary transition-all group">
                    <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-primary transition-colors">chevron_left</span>
                </button>
                {[1, 2, 3].map(page => (
                    <button 
                        key={page} 
                        className={`size-12 flex items-center justify-center rounded-2xl font-black text-xs transition-all ${page === 1 ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-primary'}`}
                    >
                        {page}
                    </button>
                ))}
                <button className="size-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary transition-all group">
                    <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default MyOrders;
