import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/login-shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { LuLock } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/home";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-light font-manrope selection:bg-primary/20">
      {/* Hidden Admin Entry */}
      <div 
        onClick={() => navigate('/admin-login')}
        className="fixed bottom-3 right-3 text-secondary opacity-5 cursor-pointer z-[9999] hover:opacity-20 transition-opacity"
        title="Admin Entry"
      >
        <FiSettings size={14} />
      </div>

      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden bg-secondary">
        <img src={loginImage} alt="Login Shoe" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-[10%] left-[10%] text-white z-10 animate-fadeIn">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">SoleVora Prime</span>
            <h2 className="text-3xl md:text-5xl font-black leading-none mb-4 italic tracking-tighter uppercase">Step into the <br /> future.</h2>
            <p className="text-sm text-gray-300 max-w-xs font-medium italic">Join our community and get exclusive access to limited drops and high-performance engineering.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative">
        <div className="absolute top-10 right-10 opacity-5 select-none pointer-events-none hidden lg:block">
            <span className="text-9xl font-black italic">VORA</span>
        </div>

        <div className="w-full max-w-md animate-fadeIn">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-secondary tracking-tighter italic uppercase">Welcome Back</h1>
            <p className="text-sm text-gray-400 font-medium mt-2 italic">Initiate your biometric secure access network.</p>
          </header>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Email Protocol</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input-standard pl-14"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Cipher Key</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Lost access?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <LuLock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-standard pl-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="h-16 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all active:scale-95 group flex items-center justify-center gap-3">
              <span>Sign In</span>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </button>

            {message && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold text-center italic animate-fadeIn">
                {message}
              </div>
            )}
          </form>

          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <span className="relative px-6 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Neural Connect</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="flex-1 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95">
              <FcGoogle size={22} /> Google
            </button>
            <button className="flex-1 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95">
              <FaApple size={20} /> Apple
            </button>
          </div>

          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
            No secure node? <Link to="/register" className="text-primary hover:underline ml-1">Establish one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;