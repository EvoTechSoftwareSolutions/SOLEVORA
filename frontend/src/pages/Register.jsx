import { useState } from "react";
import shoeImage from "../assets/shoe.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      setMessage(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed");
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/social-register", {
        name: "Google User",
        email: "googleuser@gmail.com",
      });

      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      setMessage("Google registration failed");
    }
  };

  const handleAppleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/social-register", {
        name: "Apple User",
        email: "appleuser@gmail.com",
      });

      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      setMessage("Apple registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-200">
      <div className="flex w-full max-w-6xl overflow-hidden shadow-lg rounded-2xl">
        {/* Left Side */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src={shoeImage}
            alt="shoe"
            className="object-cover w-full h-full"
          />

          <div className="absolute text-white bottom-10 left-10">
            <h2 className="text-4xl font-bold">Step into the future.</h2>
            <p className="mt-3 text-lg">
              Join our community and get exclusive <br />
              access to limited drops.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 bg-[#f8f2e8] p-12">
          <h1 className="text-5xl font-bold text-gray-900">Create Account</h1>

          <p className="mt-3 text-gray-500">
            Join Solevora for exclusive access to the latest drops.
          </p>

          <form className="mt-10 space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <label className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Create Account
            </button>

            {message && (
              <p className="text-sm text-center text-blue-600">{message}</p>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-400">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex items-center justify-center w-1/2 gap-2 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FcGoogle size={22} />
              Google
            </button>

            <button
              type="button"
              onClick={handleAppleRegister}
              className="flex items-center justify-center w-1/2 gap-2 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaApple size={20} />
              Apple
            </button>
          </div>

          {/* Sign In */}
          <div className="mt-8 text-center text-gray-500">
            Already have an account?
            <Link to="/" className="ml-2 text-orange-500 cursor-pointer">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm text-center text-gray-400">
        <p>© 2024 Solevora. All rights reserved.</p>

        <div className="flex justify-center gap-6 mt-2">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  );
}

export default Register;