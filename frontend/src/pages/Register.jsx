import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: fullName,
        email,
        password,
      });

      // If backend returns token/user, persist it; otherwise just redirect to login
      if (res?.data?.user) localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res?.data?.token) localStorage.setItem("token", res.data.token);

      navigate(res?.data?.token ? "/" : "/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope selection:bg-primary/20">
      <div className="w-full max-w-[720px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-8 md:p-14">
          <header className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[.25em] text-primary">
              SoleVora Identity
            </span>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tighter text-secondary italic">
              CREATE <span className="text-primary">ACCOUNT</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[.2em] mt-2">
              Establish your access credentials
            </p>
          </header>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">
                Full name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors">
                  <HiOutlineUser size={20} />
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="YOUR NAME"
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide uppercase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors">
                  <HiOutlineMail size={20} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="IDENTITY@DOMAIN.COM"
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide uppercase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-primary transition-colors">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-300 group-focus-within:text-primary transition-colors">
                  <HiOutlineLockClosed size={20} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-16 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 group uppercase tracking-widest"
            >
              {loading ? (
                <span className="animate-pulse">Creating…</span>
              ) : (
                <>
                  <span>Establish identity</span>
                  <HiOutlineArrowNarrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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

          <p className="mt-10 text-center text-[10px] uppercase font-black tracking-widest text-gray-400 italic">
            Already have access?{" "}
            <Link to="/login" className="text-primary hover:underline underline-offset-4 decoration-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

