import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registerImage from "../assets/login-shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { LuLock } from "react-icons/lu";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-light font-manrope selection:bg-primary/20">
      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden bg-secondary">
        <img src={registerImage} alt="Register Shoe" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-[10%] left-[10%] text-white z-10 animate-fadeIn">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">SoleVora Join</span>
            <h2 className="text-3xl md:text-5xl font-black leading-none mb-4 italic tracking-tighter uppercase">Create your <br /> legacy.</h2>
            <p className="text-sm text-gray-300 max-w-xs font-medium italic">Join the SoleVora ecosystem and experience the peak of performance engineering.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative">
        <div className="absolute top-10 right-10 opacity-5 select-none pointer-events-none hidden lg:block text-right">
            <span className="text-8xl font-black italic block">HUB</span>
            <span className="text-4xl font-black italic block -mt-4 text-primary">ACCESS</span>
        </div>

        <div className="w-full max-w-md animate-fadeIn">
          <header className="mb-8">
            <h1 className="text-4xl font-black text-secondary tracking-tighter italic uppercase">Join Vora</h1>
            <p className="text-sm text-gray-400 font-medium mt-2 italic">Initiate your biometric asset network.</p>
          </header>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Identity Tag</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <HiOutlineUser size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Lex Mercer"
                  className="input-standard pl-14"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Secure Email</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="lex@example.com"
                  className="input-standard pl-14"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Cipher</label>
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <LuLock size={18} />
                    </div>
                    <input
                    type="password"
                    name="password"
                    placeholder="••••"
                    className="input-standard pl-12"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>
                <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Confirm</label>
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <LuLock size={18} />
                    </div>
                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••"
                    className="input-standard pl-12"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>
            </div>

            <button type="submit" className="h-16 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all active:scale-95 group flex items-center justify-center gap-3 mt-4">
              <span>{isLoading ? "Syncing..." : "Initialize Profile"}</span>
              {!isLoading && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-xs font-bold text-center italic animate-fadeIn ${message.includes("successful") ? "bg-emerald-50 border border-emerald-100 text-emerald-500" : "bg-rose-50 border border-rose-100 text-rose-500"}`}>
                {message}
              </div>
            )}
          </form>

          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <span className="relative px-6 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Neural Protocol</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex-1 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95">
              <FaApple size={18} /> Apple
            </button>
          </div>

          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
            Existing secure node? <Link to="/login" className="text-primary hover:underline ml-1">Re-authenticate here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
