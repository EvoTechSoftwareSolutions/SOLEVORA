// Importing necessary libraries, components, and assets
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
  // State variables for managing user input and feedback messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Navigation hooks for redirecting users
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the redirect path after login
  const from = location.state?.from || "/home";

  // Function to handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    try {
      // Sending login credentials to the backend
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  // Function to handle Google login (demo implementation)
  const handleGoogleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "googleuser@gmail.com",
        password: "social_login",
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Google login failed");
    }
  };

  // Function to handle Apple login (demo implementation)
  const handleAppleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "appleuser@gmail.com",
        password: "social_login",
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Apple login failed");
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

      {/* Left Panel - Login Image and Overlay */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden bg-secondary">
        <img src={loginImage} alt="Login Shoe" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-[10%] left-[10%] text-white z-10 animate-fadeIn">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">SoleVora Prime</span>
          <h2 className="text-3xl md:text-5xl font-black leading-none mb-4 italic tracking-tighter uppercase">Step into the <br /> future.</h2>
          <p className="text-sm text-gray-300 max-w-xs font-medium italic">Join our community and get exclusive access to limited drops and high-performance engineering.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full px-8 py-4 md:w-1/2 md:px-8 flex flex-col justify-center bg-white">
        <h1 className="text-xl font-bold md:text-2xl text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-1 text-[#6f7d95] text-xs leading-5 max-w-md">
          Sign in to your Solevora account to access your orders and wishlist.
        </p>

        <form className="mt-4" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-2">
            <label className="block text-[#24324a] text-xs font-semibold mb-1">
              Email Address
            </label>

            <div className="flex items-center bg-[#f4f4f4] rounded-xl px-3 h-12">
              <HiOutlineMail className="text-[#94a3b8] text-base mr-2" />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full text-sm bg-transparent outline-none text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-1">
            <label className="block text-[#24324a] text-xs font-semibold mb-1">
              Password
            </label>

            <div className="flex items-center bg-[#f4f4f4] rounded-xl px-3 h-12">
              <LuLock className="text-[#94a3b8] text-base mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-sm bg-transparent outline-none text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-1 text-right">
            <Link to="/forgot-password" size="sm" className="text-[10px] font-medium text-orange-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 mt-4 text-base font-semibold text-white transition bg-orange-500 hover:bg-orange-600 rounded-xl"
          >
            Sign In
          </button>

          {/* Feedback Message */}
          {message && (
            <p className="mt-1 text-[10px] text-center text-red-600">{message}</p>
          )}
        </form>

        {/* Social Login Options */}
        <div className="flex items-center mb-3 mt-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-[10px] text-gray-400">
            Or continue with
          </span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center flex-1 gap-2 border border-gray-300 h-10 rounded-xl hover:bg-white text-xs"
          >
            <FcGoogle className="text-lg" />
            Google
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="flex items-center justify-center flex-1 gap-2 border border-gray-300 h-10 rounded-xl hover:bg-white text-xs"
          >
            <FaApple className="text-lg" />
            Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-3 text-center text-xs text-gray-500">
          Don&apos;t have an account?
          <Link to="/register" className="ml-1 text-orange-500 cursor-pointer hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
