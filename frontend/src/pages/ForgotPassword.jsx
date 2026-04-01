import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineMail, HiOutlineArrowNarrowLeft } from "react-icons/hi";

// Using high-fidelity placeholder
const FORGOT_IMAGE = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/check-email");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Transmission error. Identity not recognized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* Left Panel: Narrative Visual */}
        <div className="hidden md:block md:w-1/2 relative bg-secondary">
          <img src={FORGOT_IMAGE} alt="SoleVora Heritage" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay hover:opacity-70 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Retrieval <br /><span className="text-primary">Protocol</span></h2>
            <p className="mt-4 text-gray-300 text-sm font-medium leading-relaxed italic opacity-80">Re-establish secure access to your SoleVora magnitude profile.</p>
          </div>
        </div>

        {/* Right Panel: Identity Access */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <header className="mb-10">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-secondary italic">RESET <span className="text-primary">KEY</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em] mt-2 italic leading-relaxed">Enter your registered email to initiate the recovery transmission.</p>
          </header>

          <form onSubmit={handleForgotPassword} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">Registered Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors"><HiOutlineMail size={20} /></span>
                <input 
                  type="email" placeholder="IDENTITY@DOMAIN.COM" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide uppercase"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="h-16 bg-black text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
            >
              {loading ? <span className="animate-pulse italic">Transmitting...</span> : (
                <>
                  <span>Send Recovery Link</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">send</span>
                </>
              )}
            </button>

            {message && (
              <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 ${message.toLowerCase().includes("error") || message.toLowerCase().includes("not recognized") ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                <span className="material-symbols-outlined text-sm">info</span>
                {message}
              </div>
            )}
          </form>

          <footer className="mt-12 flex flex-col items-center gap-10">
            <Link to="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors italic">
              <HiOutlineArrowNarrowLeft size={16} />
              Return to Authentication
            </Link>
            
            <div className="w-full flex items-center gap-4">
               <div className="flex-1 h-px bg-slate-100" />
               <span className="text-[8px] font-black text-gray-200 uppercase tracking-[.3em]">Institutional Grade Security</span>
               <div className="flex-1 h-px bg-slate-100" />
            </div>
            
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic opacity-50">Need direct assistance? <span className="text-secondary hover:text-primary cursor-pointer transition-colors">Contact Concierge</span></p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;