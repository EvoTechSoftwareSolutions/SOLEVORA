import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import forgotImage from "../assets/shoe.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/check-email");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Left Side */}
        <div className="relative w-full md:w-1/2 h-[420px] md:h-screen">
          <img
            src={forgotImage}
            alt="Forgot Password Shoe"
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute z-10 text-white bottom-12 left-8 md:left-14">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-orange-400 font-semibold">
              Craftsmanship & Heritage
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Designed for the
              <br />
              <span className="text-orange-500">Modern Kinetic.</span>
            </h1>

            <p className="max-w-md mt-6 text-sm leading-7 text-gray-200 md:text-lg">
              Solevora Ember blends high-performance utility with an
              editorial aesthetic for those who move with purpose.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 bg-[#f3f3f3] flex items-center justify-center px-6 md:px-16 py-12 md:py-0">
          <div className="w-full max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold text-[#231815] leading-tight">
              Forgot your password?
            </h2>

            <p className="mt-5 text-[#7d746f] text-base md:text-lg leading-8">
              No worries, it happens. Enter your email address and we&apos;ll
              send you a link to reset it.
            </p>

            <form
              className="space-y-8 mt-14"
              onSubmit={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
            >
              <div>
                <label className="block text-[12px] font-semibold tracking-[0.2em] uppercase text-[#5b514b] mb-4">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 rounded-2xl bg-[#eceff3] px-5 text-lg text-gray-700 placeholder:text-[#a3a7ad] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-16 text-xl font-semibold text-white transition bg-orange-500 rounded-2xl hover:bg-orange-600"
              >
                Send Reset Link →
              </button>

              {message && (
                <p className="text-sm text-center text-blue-600">{message}</p>
              )}
            </form>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="text-[#4a3f39] text-xl hover:text-orange-500 transition"
              >
                ← Return to Login
              </Link>
            </div>

            <div className="pt-10 mt-20 text-center border-t border-gray-300">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#9b9b9b] font-semibold">
                Need Help?{" "}
                <span className="text-orange-500 cursor-pointer">
                  Contact Support
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;