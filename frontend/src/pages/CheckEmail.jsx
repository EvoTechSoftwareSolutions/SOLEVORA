import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMailOpen, HiOutlineArrowNarrowLeft } from "react-icons/hi";

// High-fidelity visual for email checking
const EMAIL_CHECK_IMAGE = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

function CheckEmail() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* Left Side: Cybernetic Aesthetic */}
        <div className="hidden md:block md:w-1/2 relative bg-slate-900">
          <img
            src={EMAIL_CHECK_IMAGE}
            alt="Transmission Check"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Transmission <br /><span className="text-primary italic">Status</span></h2>
            <div className="mt-6 w-12 h-1 bg-primary rounded-full shadow-lg shadow-primary/30" />
            <p className="mt-4 text-gray-400 text-sm font-medium leading-relaxed italic opacity-80 italic">SoleVora's automated link delivery protocol has been activated for your identity endpoint.</p>
          </div>
        </div>

        {/* Right Side: Identity Access */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-start">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-10 shadow-sm border border-primary/20 ring-4 ring-primary/5">
                <HiOutlineMailOpen size={36} className="animate-bounce" />
            </div>

            <header className="mb-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-secondary italic">CHECK <span className="text-primary">EMAIL</span></h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em] mt-3 leading-relaxed max-w-sm italic">Secure transmission acknowledged. We've dispatched a recovery packet to your registered endpoint.</p>
            </header>

            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-6 w-full italic">
                <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest opacity-80">Check your inbox for a verification link to facilitate secure key resetting. Please allow a few minutes for network propagation.</p>
                <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest">
                    <span className="text-gray-400">Packet delay?</span>
                    <button className="text-primary hover:underline underline-offset-4 decoration-2 cursor-pointer transition-all">Resend Recovery</button>
                </div>
            </div>

            <Link 
                to="/login"
                className="mt-12 h-16 w-full bg-black text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 group uppercase tracking-widest"
            >
                <span>Back to Port</span>
                <HiOutlineArrowNarrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            </Link>

            <footer className="w-full mt-12 pt-8 border-t border-slate-100/50 flex flex-col items-center">
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic tracking-[.3em]">Institutional Grade Encryption Protocol v2.6</p>
            </footer>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;