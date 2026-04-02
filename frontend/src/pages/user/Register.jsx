import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registerImage from "../../assets/shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { LuLock } from "react-icons/lu";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful! Redirecting...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name: "Google User",
        email: "googleuser@gmail.com",
        password: "social_register",
      });
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Google registration failed");
    }
  };

  const handleAppleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name: "Apple User",
        email: "appleuser@gmail.com",
        password: "social_register",
      });
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Apple registration failed");
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

      {/* Right Side */}
      <div className="w-full md:w-1/2 bg-[#f8f2e8] p-8 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Create Account</h1>

        <p className="mt-1 text-xs text-gray-500">
          Join Solevora for exclusive access to the latest drops.
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleRegister}>
          <div>
            <label className="block mb-1 text-xs font-semibold text-[#24324a]">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-[#24324a]">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 text-xs font-semibold text-[#24324a]">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block mb-1 text-xs font-semibold text-[#24324a]">
                Confirm
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-4 text-base font-semibold text-white transition bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          {message && (
            <p className={`text-[10px] text-center font-bold italic animate-fadeIn ${message.includes("successful") ? "text-emerald-500" : "text-rose-500"}`}>
              {message}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center mt-6 mb-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-[10px] text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-1/2 gap-2 h-10 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-xs font-medium transition-all active:scale-95"
          >
            <FcGoogle size={20} />
            Google
          </button>

          <button
            type="button"
            onClick={handleAppleRegister}
            className="flex items-center justify-center w-1/2 gap-2 h-10 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-xs font-medium transition-all active:scale-95"
          >
            <FaApple size={18} />
            Apple
          </button>
        </div>

        {/* Sign In */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?
          <Link to="/login" className="ml-1 text-orange-500 cursor-pointer font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
