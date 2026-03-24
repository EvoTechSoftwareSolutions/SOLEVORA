import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import loginImage from "../assets/login-shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { LuLock } from "react-icons/lu";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      setMessage(res.data.message);
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "googleuser@gmail.com",
        password: "social_login",
      });

      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Google login failed");
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: "appleuser@gmail.com",
        password: "social_login",
      });

      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Apple login failed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-100">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden bg-[#f7f1e4] shadow-md flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-auto">
          <img
            src={loginImage}
            alt="Login Shoe"
            className="object-cover w-full h-full"
          />

          <div className="absolute text-white bottom-10 left-8">
            <h2 className="text-3xl font-bold md:text-4xl">
              Step into the future.
            </h2>
            <p className="mt-3 text-lg leading-8">
              Join our community and get exclusive <br />
              access to limited drops.
            </p>
          </div>

          <div className="absolute p-3 bg-white rounded-full shadow-md bottom-6 right-6">
            <FaUser className="text-lg text-gray-700" />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full px-8 py-12 md:w-1/2 md:px-16">
          <h1 className="text-4xl font-bold md:text-5xl text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-4 text-[#6f7d95] text-lg leading-8 max-w-md">
            Sign in to your Solevora account to access your orders and wishlist.
          </p>

          <form className="mt-10" onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-[#24324a] font-semibold mb-3">
                Email Address
              </label>

              <div className="flex items-center bg-[#f4f4f4] rounded-xl px-4 h-16">
                <HiOutlineMail className="text-[#94a3b8] text-xl mr-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full text-lg bg-transparent outline-none text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[#24324a] font-semibold mb-3">
                Password
              </label>

              <div className="flex items-center bg-[#f4f4f4] rounded-xl px-4 h-16">
                <LuLock className="text-[#94a3b8] text-xl mr-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-lg bg-transparent outline-none text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 text-right">
              <Link to="/forgot-password" className="font-medium text-orange-500">
  Forgot Password?
</Link>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-10 text-xl font-semibold text-white transition bg-orange-500 hover:bg-orange-600 rounded-xl"
            >
              Sign In
            </button>

            {message && (
              <p className="mt-4 text-sm text-center text-red-600">{message}</p>
            )}
          </form>

          <div className="flex items-center mb-8 mt-14">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-400">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center flex-1 gap-2 border border-gray-300 h-14 rounded-xl hover:bg-white"
            >
              <FcGoogle className="text-xl" />
              Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              className="flex items-center justify-center flex-1 gap-2 border border-gray-300 h-14 rounded-xl hover:bg-white"
            >
              <FaApple className="text-xl" />
              Apple
            </button>
          </div>

          <p className="mt-10 text-center text-gray-500">
            Don&apos;t have an account?
            <Link to="/register" className="ml-2 text-orange-500 cursor-pointer">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-10 text-sm text-center text-gray-400">
        <p>© 2024 Solevora. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  );
}

export default Login;