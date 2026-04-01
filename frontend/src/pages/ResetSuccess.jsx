import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineArrowNarrowLeft } from "react-icons/hi";

// High-fidelity visual for success
const SUCCESS_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

function ResetSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* Left Side: Visual Narrative */}
        <div className="hidden md:block md:w-1/2 relative bg-secondary">
          <img
            src={SUCCESS_IMAGE}
            alt="Success Footwear"
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay hover:opacity-70 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10 flex flex-col items-start gap-4">
            <span className="px-4 py-1.5 bg-primary rounded-full text-[9px] font-black uppercase tracking-[.3em] text-white shadow-xl shadow-primary/30">Limited Edition</span>
            <p className="text-sm font-medium text-gray-300 leading-relaxed italic opacity-80 italic">Redefining the pace of modern retail with curated precision and kinetic energy.</p>
          </div>
        </div>

        {/* Right Side: Identity Access */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-start text-left relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-10 shadow-lg shadow-emerald-500/10 border-4 border-white relative z-10">
                <HiOutlineCheckCircle size={48} className="animate-pulse" />
            </div>

            <header className="mb-10 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-secondary leading-[.9] italic">RESET <br /><span className="text-primary italic">SUCCESSFUL</span></h1>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-6 leading-relaxed max-w-sm italic opacity-80">Encryption sequence updated. Your identity access points are now functional with the new security key.</p>
            </header>

            <Link 
                to="/login"
                className="mt-8 h-18 w-full bg-black text-white rounded-[1.5rem] font-black text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-2xl shadow-black/10 active:scale-95 group uppercase tracking-widest relative z-10 h-16"
            >
                <span>Back to Hub Access</span>
                <HiOutlineArrowNarrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            </Link>

            <footer className="w-full mt-16 pt-8 border-t border-slate-100/50 flex flex-col items-center relative z-10">
                <div className="flex gap-1.5 opacity-20 group">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:bg-primary transition-colors" />
                    ))}
                </div>
                <p className="mt-4 text-[9px] text-gray-300 font-bold uppercase tracking-widest italic tracking-[.3em]">Institutional Grade Security Verified</p>
            </footer>

            {/* Corner Decor */}
            <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-end gap-2 opacity-10">
                <span className="text-4xl font-light">✦</span>
                <span className="text-6xl font-light translate-x-4">✦</span>
                <span className="text-2xl font-light">✦</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ResetSuccess;