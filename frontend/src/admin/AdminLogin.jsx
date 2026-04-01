import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineArrowLeft, HiOutlineLogin } from "react-icons/hi";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
            localStorage.setItem('admin_token', res.data.token);
            localStorage.setItem('admin_user', JSON.stringify(res.data.user));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization failed. Protocol rejected.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-6 relative overflow-hidden font-manrope selection:bg-primary/20">
            
            {/* Immersive Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000" />
            
            <div className="w-full max-w-[440px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative z-10 animate-fadeIn">
                
                {/* Branding & Header */}
                <header className="flex flex-col items-center mb-10">
                    <div className="px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2 mb-6">
                        <HiOutlineShieldCheck className="text-primary text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Auth Protocol</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">ADMIN <span className="text-primary italic">GATEWAY</span></h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[.3em] mt-3">Solevora Network Infrastructure</p>
                </header>

                <form onSubmit={handleLogin} className="flex flex-col gap-6 italic">
                    <div className="flex flex-col gap-2 group">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-primary transition-colors">Commander Identity</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-gray-600 group-focus-within:text-primary transition-colors"><HiOutlineMail size={20} /></span>
                            <input 
                                type="email" placeholder="IDENTITY@SOLE-VORA.NET" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest text-white placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 group">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-primary transition-colors">Access Key</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-gray-600 group-focus-within:text-primary transition-colors"><HiOutlineLockClosed size={20} /></span>
                            <input 
                                type="password" placeholder="••••••••" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs text-white placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="mt-4 h-16 bg-primary text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                            <>
                                <span>Initialize Override</span>
                                <HiOutlineLogin size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm">priority_high</span>
                            {error}
                        </div>
                    )}
                </form>

                {/* Role Transparency */}
                <footer className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center">
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Root Admin</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Store Manager</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="mt-10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-primary transition-colors">
                        <HiOutlineArrowLeft />
                        Return to Frontline
                    </button>
                    <p className="mt-10 text-[8px] font-bold text-gray-800 tracking-[.5em] uppercase">Solevora Neural Grid v2.6</p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLogin;
