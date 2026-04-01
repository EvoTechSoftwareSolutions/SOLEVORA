import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineTruck, 
    HiOutlineUserGroup, 
    HiOutlineCheckCircle, 
    HiOutlineExclamationCircle,
    HiOutlineX,
    HiOutlineSave,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash
} from "react-icons/hi";

const API = 'http://localhost:5000/api/admin';

const authHeaders = (adminUser) => ({ 'x-admin-id': adminUser?.id });

const Settings = () => {
    const { adminUser } = useAdminAuth();

    const [activeTab, setActiveTab] = useState('store');
    const [settings, setSettings] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'store_manager' });

    useEffect(() => {
        const load = async () => {
            try {
                const [settingsRes, staffRes] = await Promise.all([
                    axios.get(`${API}/settings`,     { headers: authHeaders(adminUser) }),
                    axios.get(`${API}/admin-users`,  { headers: authHeaders(adminUser) })
                ]);
                setSettings(settingsRes.data);
                setStaffList(staffRes.data);
            } catch (err) {
                showToast(err.response?.data?.message || 'Network extraction failed', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [adminUser]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API}/settings`, settings, { headers: authHeaders(adminUser) });
            showToast('Protocol updated successfully!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Configuration failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const openNewStaff = () => {
        setEditingStaff(null);
        setStaffForm({ name: '', email: '', password: '', role: 'store_manager' });
        setShowStaffModal(true);
    };

    const openEditStaff = (member) => {
        setEditingStaff(member);
        setStaffForm({ name: member.name, email: member.email, password: '', role: member.role });
        setShowStaffModal(true);
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingStaff) {
                const res = await axios.put(`${API}/admin-users/${editingStaff.id}`, staffForm, { headers: authHeaders(adminUser) });
                setStaffList(prev => prev.map(m => m.id === editingStaff.id ? { ...m, ...res.data.user } : m));
                showToast('Personnel refactored');
            } else {
                await axios.post(`${API}/admin-users`, staffForm, { headers: authHeaders(adminUser) });
                const refreshed = await axios.get(`${API}/admin-users`, { headers: authHeaders(adminUser) });
                setStaffList(refreshed.data);
                showToast('Personnel injected');
            }
            setShowStaffModal(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Biological override failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Erase this personnel identity?')) return;
        try {
            await axios.delete(`${API}/admin-users/${id}`, { headers: authHeaders(adminUser) });
            setStaffList(prev => prev.filter(m => m.id !== id));
            showToast('Identity terminated');
        } catch (err) {
            showToast(err.response?.data?.message || 'Termination failed', 'error');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">Accessing System Core...</h4>
        </div>
    );

    const TABS = [
        { id: 'store',    label: 'Architecture',   icon: <HiOutlineOfficeBuilding size={20} /> },
        { id: 'shipping', label: 'Logistics',      icon: <HiOutlineTruck size={20} /> },
        { id: 'staff',    label: 'Personnel',      icon: <HiOutlineUserGroup size={20} /> },
    ];

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Toast Notifications */}
            {toast && (
                <div className={`fixed top-10 right-10 z-[5000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-scaleIn border font-black text-[10px] uppercase tracking-widest ${toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    {toast.type === 'error' ? <HiOutlineExclamationCircle size={20} /> : <HiOutlineCheckCircle size={20} />}
                    {toast.msg}
                </div>
            )}

            {/* Staff Modal */}
            {showStaffModal && (
                <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                        <header className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                             <h3 className="text-xl font-black uppercase tracking-tighter text-secondary italic">{editingStaff ? 'Refactor' : 'Inject'} <span className="text-primary">Personnel</span></h3>
                             <button onClick={() => setShowStaffModal(false)} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all"><HiOutlineX /></button>
                        </header>
                        <form onSubmit={handleStaffSubmit} className="p-10 flex flex-col gap-6">
                            <div className="flex flex-col gap-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Identity Name</label>
                                <input required value={staffForm.name} onChange={e => setStaffForm(p => ({ ...p, name: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" placeholder="CORE OPERATOR" />
                            </div>
                            <div className="flex flex-col gap-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Neural Endpoint</label>
                                <input required type="email" value={staffForm.email} onChange={e => setStaffForm(p => ({ ...p, email: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" placeholder="IDENTITY@SOLE-VORA.NET" />
                            </div>
                            <div className="flex flex-col gap-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">{editingStaff ? 'Override Access Key (Optional)' : 'Access Key'}</label>
                                <input type="password" required={!editingStaff} value={staffForm.password} onChange={e => setStaffForm(p => ({ ...p, password: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" placeholder="••••••••" />
                            </div>
                            <div className="flex flex-col gap-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Authorization Tier</label>
                                <select value={staffForm.role} onChange={e => setStaffForm(p => ({ ...p, role: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest appearance-none">
                                    <option value="store_manager">Store Manager (Operational)</option>
                                    <option value="admin">System Admin (Root)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="button" onClick={() => setShowStaffModal(false)} className="flex-1 h-14 bg-white border border-slate-100 text-gray-400 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:text-rose-500 transition-all">Abort</button>
                                <button type="submit" disabled={saving} className="flex-[2] h-14 bg-secondary text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50">{saving ? 'Transmitting...' : 'Commit identity'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <header>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">SYSTEM <span className="text-primary italic">CONFIG</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Infrastructure Overrides • Security Protocols Enabled</p>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
                
                {/* Navigation Sidebar */}
                <nav className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-1 lg:sticky lg:top-10">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${activeTab === t.id ? 'bg-secondary text-white shadow-xl shadow-secondary/10 scale-105' : 'text-gray-400 hover:bg-slate-50 hover:text-secondary'}`}
                        >
                            <span className={activeTab === t.id ? 'text-white' : 'group-hover:text-primary'}>{t.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="lg:col-span-3 bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group/content">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover/content:bg-primary/10 transition-all duration-1000" />
                    
                    {/* Store Architecture */}
                    {activeTab === 'store' && settings && (
                        <form onSubmit={handleSaveSettings} className="flex flex-col gap-10 relative z-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-primary pl-4">Network Node Parameters</h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-5 italic">Primary infrastructure identification</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Node Designation (Name)</label>
                                    <input value={settings.storeName || ''} onChange={e => setSettings(p => ({ ...p, storeName: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Neural Contact (Email)</label>
                                    <input type="email" value={settings.storeEmail || ''} onChange={e => setSettings(p => ({ ...p, storeEmail: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Secure Line (Phone)</label>
                                    <input value={settings.storePhone || ''} onChange={e => setSettings(p => ({ ...p, storePhone: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Valuation Token (Currency)</label>
                                    <select value={settings.storeCurrency || 'USD'} onChange={e => setSettings(p => ({ ...p, storeCurrency: e.target.value }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest appearance-none">
                                        <option value="USD">USD - Global Reserve</option>
                                        <option value="LKR">LKR - Sri Lankan Node</option>
                                        <option value="EUR">EUR - European Core</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Critical Magnitude Warning Threshold</label>
                                    <input type="number" value={settings.lowStockThreshold ?? 20} onChange={e => setSettings(p => ({ ...p, lowStockThreshold: parseInt(e.target.value) }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-50 flex flex-col gap-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 hover:border-primary/20 transition-all">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Biological Maintenance Mode</h4>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Suspend storefront propagation immediately</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setSettings(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${settings.maintenanceMode ? 'bg-primary' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-500 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 hover:border-primary/20 transition-all">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Anonymous Procurement</h4>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Allow guest checkout flow</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setSettings(p => ({ ...p, allowGuestCheckout: !p.allowGuestCheckout }))}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${settings.allowGuestCheckout ? 'bg-primary' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-500 ${settings.allowGuestCheckout ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={saving} className="mt-4 h-16 bg-secondary text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-secondary/10 active:scale-95 disabled:opacity-50 group italic">
                                <HiOutlineSave size={20} className="group-hover:rotate-12 transition-transform" />
                                {saving ? 'Transmitting Data...' : 'Commit Store Overrides'}
                            </button>
                        </form>
                    )}

                    {/* Logistics Config */}
                    {activeTab === 'shipping' && settings && (
                        <form onSubmit={handleSaveSettings} className="flex flex-col gap-10 relative z-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-blue-500 pl-4">Logistical Parameters</h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-5 italic">Global distribution node cost analysis</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-blue-500 transition-colors">Standard Transfer Fee ({settings.storeCurrency})</label>
                                    <input type="number" step="0.01" value={settings.shippingFee ?? 350} onChange={e => setSettings(p => ({ ...p, shippingFee: parseFloat(e.target.value) }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-blue-500 transition-colors">Free Transfer Threshold ({settings.storeCurrency})</label>
                                    <input type="number" step="0.01" value={settings.freeShippingThreshold ?? 5000} onChange={e => setSettings(p => ({ ...p, freeShippingThreshold: parseFloat(e.target.value) }))} className="h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-bold text-xs uppercase tracking-widest" />
                                </div>
                            </div>
                            <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-4 italic group/info">
                                 <HiOutlineTruck size={24} className="text-blue-500 shrink-0 group-hover/info:translate-x-2 transition-transform" />
                                 <div>
                                     <h5 className="text-[9px] font-black uppercase tracking-widest text-blue-600">Active Logistic Logic</h5>
                                     <p className="text-[10px] font-bold text-blue-900/60 leading-relaxed mt-2 uppercase tracking-tight">Magnitudes exceeding <span className="text-blue-900 font-black">{settings.storeCurrency} {settings.freeShippingThreshold?.toLocaleString()}</span> will initiate zero-cost delivery. Local node baseline: <span className="text-blue-900 font-black">{settings.storeCurrency} {settings.shippingFee}</span>.</p>
                                 </div>
                            </div>
                            <button type="submit" disabled={saving} className="mt-10 h-16 bg-black text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 group italic">
                                <HiOutlineSave size={20} className="group-hover:translate-x-1 transition-transform" />
                                {saving ? 'Transmitting Data...' : 'Commit logistics Overrides'}
                            </button>
                        </form>
                    )}

                    {/* Personnel Management */}
                    {activeTab === 'staff' && (
                        <div className="flex flex-col gap-10 relative z-10">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary border-l-4 border-emerald-500 pl-4">Administrative Mesh</h3>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-5 italic">{staffList.length} Authenticated Nodes active</p>
                                </div>
                                <button onClick={openNewStaff} className="h-14 px-8 bg-emerald-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 active:scale-95"><HiOutlinePlus size={20} /> Inject Personnel</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {staffList.map(member => (
                                    <div key={member.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6 group/card hover:bg-white hover:shadow-2xl transition-all duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-secondary group-hover/card:scale-110 transition-transform">
                                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-secondary truncate">{member.name}</h4>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{member.email}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${member.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {member.role === 'admin' ? 'ROOT' : 'OPERATOR'}
                                            </span>
                                        </div>
                                        {member.lastLogin && (
                                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic ml-1">Last Secure Link: {new Date(member.lastLogin).toLocaleDateString()}</p>
                                        )}
                                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                                             <button onClick={() => openEditStaff(member)} className="flex-1 h-11 bg-white text-gray-400 rounded-xl text-[8px] font-black uppercase border border-slate-100 hover:text-black hover:border-black transition-all flex items-center justify-center gap-2"><HiOutlinePencil /> Refactor</button>
                                             <button onClick={() => handleDeleteStaff(member.id)} className="flex-1 h-11 bg-white text-gray-400 rounded-xl text-[8px] font-black uppercase border border-slate-100 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2"><HiOutlineTrash /> Terminate</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] opacity-40 pb-12 italic">System Core Configuration v2.6.4 • Secure Override Mode Active</p>

        </div>
    );
};

export default Settings;
