import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    HiOutlineViewGrid, 
    HiOutlineShoppingBag, 
    HiOutlineUsers, 
    HiOutlineCube, 
    HiOutlineChartBar, 
    HiOutlineCog, 
    HiOutlineLogout,
    HiOutlineMenuAlt2,
    HiOutlineX
} from "react-icons/hi";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    // Retrieve admin info
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    const role = adminUser.role || 'Admin';

    const menuItems = [
        { name: "Overview", path: "/admin", icon: <HiOutlineViewGrid size={22} />, roles: ["admin", "store_manager"] },
        { name: "Inventory", path: "/admin/products", icon: <HiOutlineCube size={22} />, roles: ["admin", "store_manager"] },
        { name: "Orders", path: "/admin/orders", icon: <HiOutlineShoppingBag size={22} />, roles: ["admin", "store_manager"] },
        { name: "Intelligence", path: "/admin/analytics", icon: <HiOutlineChartBar size={22} />, roles: ["admin", "store_manager"] },
        { name: "Personnel", path: "/admin/customers", icon: <HiOutlineUsers size={22} />, roles: ["admin", "store_manager"] },
        { name: "System Config", path: "/admin/settings", icon: <HiOutlineCog size={22} />, roles: ["admin"] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(role.toLowerCase()));

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin-login');
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-6 z-[2000] lg:hidden w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
                {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt2 size={24} />}
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1800] lg:hidden animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-100 z-[1900] transform transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static flex flex-col p-8 font-manrope italic`}>
                
                {/* Branding */}
                <div className="mb-14 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                         <HiOutlineCube size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter text-secondary italic leading-none">SOLE<span className="text-primary">VORA</span></h1>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[.4em] mt-1">Admin Backbone</p>
                    </div>
                </div>

                {/* Primary Nav */}
                <nav className="flex-1 flex flex-col gap-2">
                    <h5 className="text-[9px] font-black uppercase tracking-[.3em] text-gray-300 mb-4 px-4">Directives</h5>
                    {filteredItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive ? 'bg-secondary text-white shadow-xl shadow-secondary/20 scale-[1.02]' : 'text-gray-400 hover:bg-slate-50 hover:text-secondary'}`}
                            >
                                <span className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{item.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Account Actions */}
                <div className="mt-auto pt-8 border-t border-slate-50">
                    <div className="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-sm">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser.name || 'Admin'}`} alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary truncate">{adminUser.name || 'Root Operator'}</h4>
                             <p className="text-[8px] font-bold text-primary uppercase tracking-widest opacity-60 truncate">{role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-400 hover:bg-rose-50 transition-all group uppercase"
                    >
                        <HiOutlineLogout size={22} className="group-hover:text-rose-600" />
                        <span className="text-[10px] font-black tracking-widest group-hover:text-rose-600">Terminate Session</span>
                    </button>
                    <p className="mt-8 text-center text-[8px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-40">System Core v2.6.4</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
