import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineShieldCheck, HiOutlineCheckCircle } from "react-icons/hi";

// High-fidelity visual for reset context
const RESET_IMAGE = "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-manrope">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-rose-100 flex flex-col items-center gap-6 animate-fadeIn">
            <span className="material-symbols-outlined text-rose-500 text-5xl">warning</span>
            <h2 className="text-xl font-black uppercase tracking-tighter text-rose-600 italic">Invalid Transmission Link</h2>
            <Link to="/login" className="px-8 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-sm">Restart Protocol</Link>
        </div>
      </div>
    );
  }

  const hasMinLength = newPassword.length >= 8;
  const hasSpecialAndNumber = /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage("Please complete all security entries.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Security keys do not match. Re-verify input.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`http://localhost:5000/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/reset-success");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Protocol failure. Contact HQ support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* Left Side: Modern Kinetic Aesthetics */}
        <div className="hidden md:block md:w-1/2 relative bg-slate-900 leading-none">
          <img
            src={RESET_IMAGE}
            alt="SoleVora Security"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
              RESET <br /><span className="text-primary">SECURITY</span>
            </h1>
            <p className="text-sm font-medium text-gray-300 leading-relaxed italic opacity-80 italic">Updating your encrypted magnitude access. Ensure your new sequence meets institutional standards.</p>
          </div>
        </div>

        {/* Right Side: Identity Access */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <header className="mb-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">NEW <span className="text-primary">KEY</span></h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em] mt-3 italic leading-relaxed">Establish a high-fidelity security sequence. Avoid reuse of previous legacy keys.</p>
            </header>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Primary Security Key</label>
                    <div className="relative flex items-center">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" required
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 text-gray-300 hover:text-primary transition-colors"
                        >
                            {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Confirm Key Sequence</label>
                    <div className="relative flex items-center">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" required
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                {/* Password Strength Checklist */}
                <div className="bg-slate-50/80 p-6 rounded-[1.5rem] border border-slate-100 flex flex-col gap-4 italic relative overflow-hidden group">
                    <h5 className="text-[9px] font-black text-secondary uppercase tracking-[.3em] flex items-center gap-2">
                        <HiOutlineShieldCheck size={14} className="text-primary" />
                        Sequence Strength Analysis
                    </h5>
                    <div className="flex flex-col gap-3">
                        <div className={`flex items-center gap-3 text-[10px] uppercase font-black tracking-widest transition-all ${hasMinLength ? 'text-emerald-600 translate-x-2' : 'text-gray-400'}`}>
                            <HiOutlineCheckCircle className={hasMinLength ? 'text-emerald-500' : 'text-gray-200'} size={18} />
                            <span>8+ CHARACTER MAGNITUDE</span>
                        </div>
                        <div className={`flex items-center gap-3 text-[10px] uppercase font-black tracking-widest transition-all ${hasSpecialAndNumber ? 'text-emerald-600 translate-x-2' : 'text-gray-400'}`}>
                            <HiOutlineCheckCircle className={hasSpecialAndNumber ? 'text-emerald-500' : 'text-gray-200'} size={18} />
                            <span>DIGIT & SYMBOL INCLUSION</span>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" disabled={loading}
                    className="h-16 bg-black text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
                >
                    {loading ? <span className="animate-pulse">Rewriting Protocol...</span> : (
                        <>
                            <span>Update Security Key</span>
                            <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-700">refresh</span>
                        </>
                    )}
                </button>

                {message && (
                    <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 ${message.toLowerCase().includes("failed") || message.toLowerCase().includes("not match") ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <span className="material-symbols-outlined text-sm">info</span>
                        {message}
                    </div>
                )}
            </form>

            <footer className="mt-12 text-center">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors italic flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">west</span>
                    Return to Authentication Hub
                </Link>
            </footer>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;