import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const VerificationCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    // Add logic to resend the code
  };

  const handleVerify = () => {
    // Logic to verify the code
    navigate("/home");
  };

  return (
    <div className="bg-[#f5f0ea] min-h-screen flex flex-col items-center justify-center py-20 px-6 font-manrope">
      <div className="w-full max-w-[540px] flex flex-col items-center text-center">
        
        {/* Header Icon */}
        <div className="mb-10 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5">
          <span className="material-symbols-outlined text-3xl font-black">schedule</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tighter leading-none mb-4">VERIFY <span className="text-primary italic">ACCOUNT</span></h1>
        <p className="text-sm md:text-base text-gray-500 font-bold uppercase tracking-widest italic mb-10">We've sent a 6-digit code to <span className="text-secondary font-black">+1 (555) ••• ••00</span></p>

        {/* Verification Inputs */}
        <div className="flex gap-2 md:gap-4 mb-12">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-12 md:w-16 md:h-16 bg-white border-none rounded-2xl text-center text-xl md:text-2xl font-black text-secondary shadow-sm focus:ring-4 focus:ring-primary/20 focus:-translate-y-1 transition-all outline-none"
            />
          ))}
        </div>

        <button 
          onClick={handleVerify}
          className="w-full h-16 bg-primary text-white rounded-full font-black text-sm flex items-center justify-center gap-3 hover:bg-[#c96c2a] transition-all shadow-xl shadow-primary/30 active:scale-95 group uppercase tracking-widest"
        >
          <span>Verify Account</span>
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">verified_user</span>
        </button>

        {/* Resend Row */}
        <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className="text-gray-400 italic">Didn't receive code?</span>
            <button 
                onClick={handleResend}
                disabled={!canResend}
                className={`text-primary hover:underline disabled:opacity-30 disabled:no-underline transition-all`}
            >
                Resend SMS
            </button>
            <span className="text-gray-200">|</span>
            <span className={`w-8 text-secondary ${timer === 0 ? 'opacity-0' : 'opacity-100'}`}>00:{timer < 10 ? `0${timer}` : timer}</span>
        </div>

        {/* Back link */}
        <Link to="/home" className="mt-16 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-base">west</span>
            Return to Dashboard
        </Link>

        {/* Security Banner Card */}
        <div className="mt-20 w-full bg-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-black/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent" />
            <div className="flex-1 text-left flex flex-col gap-4 relative z-10">
                <div className="flex gap-3 mb-2 opacity-30">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span className="material-symbols-outlined text-base">security</span>
                    <span className="material-symbols-outlined text-base">enhanced_encryption</span>
                </div>
                <h5 className="text-[10px] font-black text-primary uppercase tracking-[.3em]">Institutional Grade Security</h5>
                <p className="text-sm font-medium text-gray-400 leading-relaxed italic">Your account is protected by 256-bit encryption and multi-factor authentication. SoleVora never shares your private data.</p>
            </div>
            <div className="w-40 h-24 bg-gray-50 rounded-3xl -rotate-12 translate-x-8 translate-y-8 flex items-center justify-center shrink-0 shadow-inner group-hover:translate-x-4 transition-all duration-700">
                <div className="w-32 h-16 bg-white rounded-2xl shadow-sm rotate-6" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default VerificationCode;
