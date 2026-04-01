import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    HiOutlineMail, 
    HiOutlineLockClosed, 
    HiOutlineLogin
} from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";

// Using a placeholder image for the login panel to ensure high-fidelity migration
const LOGIN_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
            <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                
                {/* Left Panel: Narrative Visual */}
                <div className="hidden md:block md:w-1/2 relative bg-slate-900">
                    <img src={LOGIN_IMAGE} alt="SoleVora Premium" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-80 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <div className="w-16 h-1 bg-primary mb-6" />
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Return to the <br /><span className="text-primary">Echelon</span></h2>
                        <p className="mt-4 text-gray-300 text-sm font-medium leading-relaxed italic opacity-80">Access your curated selection, tracking intelligence, and member-only magnitude drops.</p>
                    </div>
                </div>

                {/* Right Panel: Identity Access */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                    <header className="mb-10">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">SIGN <span className="text-primary">IN</span></h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[.2em] mt-2">Personal Identity Authentication</p>
                    </header>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Access Email</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors"><HiOutlineMail size={20} /></span>
                                <input 
                                    type="email" placeholder="IDENTITY@DOMAIN.COM" required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Security Key</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors"><HiOutlineLockClosed size={20} /></span>
                                <input 
                                    type="password" placeholder="••••••••" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                                />
                            </div>
                            <div className="text-right mt-1">
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Code Retrieval?</Link>
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="h-16 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
                        >
                            {loading ? <span className="animate-pulse">Verifying...</span> : (
                                <>
                                    <span>Initiate Access</span>
                                    <HiOutlineLogin size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="bg-rose-50 text-rose-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">priority_high</span>
                                {error}
                            </div>
                        )}
                    </form>

                    <div className="mt-10 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Connect via External Neural</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                                <FaGoogle className="text-rose-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                            </button>
                            <button className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                                <FaGithub className="text-slate-900 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-12 text-center text-[10px] uppercase font-black tracking-widest text-gray-400 italic">
                        New to the movement? <Link to="/register" className="text-primary hover:underline underline-offset-4 decoration-2">Establish Identity</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;