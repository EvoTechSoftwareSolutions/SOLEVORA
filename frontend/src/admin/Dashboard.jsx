import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HiOutlineTrendingUp, 
    HiOutlineTrendingDown, 
    HiOutlineCurrencyDollar, 
    HiOutlineShoppingBag, 
    HiOutlineUsers, 
    HiOutlineColorSwatch,
    HiOutlineArrowNarrowRight
} from "react-icons/hi";

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock data for high-fidelity demonstration
    const metrics = [
        { title: 'Gross Magnitude', value: '$84,290.00', trend: '+12.5%', isUp: true, icon: <HiOutlineCurrencyDollar />, color: 'text-primary bg-primary/10' },
        { title: 'Total Procurements', value: '1,240', trend: '+8.2%', isUp: true, icon: <HiOutlineShoppingBag />, color: 'text-blue-500 bg-blue-500/10' },
        { title: 'Active Personnel', value: '4,821', trend: '-2.4%', isUp: false, icon: <HiOutlineUsers />, color: 'text-purple-500 bg-purple-500/10' },
        { title: 'Conversion Rate', value: '3.42%', trend: '+0.8%', isUp: true, icon: <HiOutlineColorSwatch />, color: 'text-emerald-500 bg-emerald-500/10' },
    ];

    const recentOrders = [
        { id: '#SV-9912', customer: 'Alexander Vance', product: 'Nike Jordan Retro 1', amount: '$190.00', status: 'delivered', date: 'Oct 12', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        { id: '#SV-9845', customer: 'Seraphina Moon', product: 'Adidas Yeezy Boost', amount: '$220.00', status: 'processing', date: 'Oct 11', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sera' },
        { id: '#SV-9733', customer: 'Marcus Thorne', product: 'Air Max Pulse', amount: '$160.00', status: 'delivered', date: 'Oct 11', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
        { id: '#SV-9621', customer: 'Elena Rossi', product: 'Solaris High-Top', amount: '$280.00', status: 'cancelled', date: 'Oct 10', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    ];

    const topProducts = [
        { name: 'Jordan Retro 1 High', sales: 482, value: '$91,580', progress: 85, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
        { name: 'Yeezy Boost 350', sales: 321, value: '$70,620', progress: 65, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
        { name: 'Air Max 270', sales: 298, value: '$44,700', progress: 55, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100' },
    ];

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">COMMAND <span className="text-primary italic">OVERVIEW</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-1">Live Magnitude Stream • Network Status: Nominal</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {['24H', '7D', '30D', '1Y'].map((t, i) => (
                        <button key={t} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${i===1 ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105' : 'text-gray-400 hover:text-secondary'}`}>{t}</button>
                    ))}
                </div>
            </header>

            {/* Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${m.color}`}>{m.icon}</div>
                             <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm ${m.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                {m.isUp ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
                                {m.trend}
                             </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.title}</p>
                            <h3 className="text-2xl font-black text-secondary mt-1">{m.value}</h3>
                        </div>
                    </div>
                ))}
            </section>

            {/* Central Intelligence Chart */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-primary pl-4">Procurement Intelligence</h3>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-5 italic">Projected Volume vs Realized Transaction Flow</p>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:underline group-hover:translate-x-2 transition-transform italic">Download Data Spec <HiOutlineArrowNarrowRight /></button>
                 </div>
                 
                 {/* Mock Chart SVG */}
                 <div className="w-full h-80 relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f66d3b" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#f66d3b" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,280 Q200,200 400,240 T800,100 T1200,180 T1600,120 L1600,320 L0,320 Z" fill="url(#chartGradient)" />
                        <path d="M0,280 Q200,200 400,240 T800,100 T1200,180 T1600,120" fill="none" stroke="#f66d3b" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex justify-between items-end px-4 opacity-50 pb-2 pointer-events-none">
                         {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                             <span key={day} className="text-[9px] font-black uppercase tracking-widest text-gray-300">{day}</span>
                         ))}
                    </div>
                 </div>
            </section>

            {/* Bottom Operations Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                
                {/* Recent Transaction Log */}
                <div className="xl:col-span-2 flex flex-col gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center">
                         <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-secondary pl-4">Live Transaction Log</h3>
                         <button onClick={() => navigate('/admin/orders')} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline italic">Full Archive</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 px-2">Order ID</th>
                                    <th className="pb-4 px-2">Personnel</th>
                                    <th className="pb-4 px-2">Magnitude</th>
                                    <th className="pb-4 px-2 text-center">Status</th>
                                    <th className="pb-4 px-2 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 px-2 text-xs font-black text-secondary group-hover:text-primary transition-colors">{order.id}</td>
                                        <td className="py-5 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shrink-0">
                                                    <img src={order.img} alt="" />
                                                </div>
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-tight">{order.customer}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[120px]">{order.product}</td>
                                        <td className="py-5 px-2 text-center">
                                             <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                order.status === 'processing' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-500'
                                             }`}>{order.status}</span>
                                        </td>
                                        <td className="py-5 px-2 text-right text-xs font-black text-secondary">{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Magnitude */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                         <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-primary pl-4">Peak Magnitude</h3>
                    </div>
                    <div className="flex flex-col gap-10 italic">
                        {topProducts.map((p, i) => (
                            <div key={i} className="flex flex-col gap-4 group">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                                        <img src={p.img} alt="" className="w-full h-full object-contain" />
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className="text-[10px] font-black uppercase tracking-tighter text-secondary leading-tight truncate">{p.name}</h4>
                                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{p.sales} Units Transacted</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-xs font-black text-primary">{p.value}</p>
                                     </div>
                                </div>
                                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                     <div 
                                        className="h-full bg-primary rounded-full group-hover:opacity-80 transition-all duration-1000 ease-out" 
                                        style={{ width: `${p.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/admin/products')} className="mt-8 w-full h-14 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-secondary hover:text-white transition-all active:scale-95">Integrate Inventory View</button>
                </div>

            </section>

        </div>
    );
};

export default Dashboard;
