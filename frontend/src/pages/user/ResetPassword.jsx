import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LuEye, LuCircleCheck, LuCircle } from "react-icons/lu";
import resetImage from "../../assets/reset-password.png";
import "./../../styles/Auth.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <p className="text-xl text-red-500">Invalid reset link</p>
      </div>
    );
  }
  // password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasSpecialAndNumber =
    /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword);
// reset password function
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }
// basic validation
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/reset-password/${token}`,
        { newPassword }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/reset-success");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Reset failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Left Side */}
        <div className="relative w-full md:w-1/2 h-[420px] md:h-screen">
          <img
            src={resetImage}
            alt="Reset Password"
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute z-10 text-white left-8 md:left-14 bottom-24">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Redefining the
              <br />
              <span className="text-orange-500">Kinetic</span> Standard.
            </h1>

            <p className="max-w-xl mt-6 text-lg leading-9 text-gray-200 md:text-xl">
              Performance meets luxury. Secure your account to access
              our curated archive of high-utility footwear.
            </p>
          </div>

          <div className="absolute z-10 flex items-center gap-4 -translate-x-1/2 bottom-12 left-1/2">
            <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
            <div className="w-10 h-1 rounded-full bg-gray-500/60"></div>
            <div className="w-10 h-1 rounded-full bg-gray-500/40"></div>
          </div>
        </div>


      {/* Right Side */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">
            Set a new<br />password
          </h2>
          <p className="auth-subtitle">
            Your new password must be different from previous passwords
            to ensure maximum security.
          </p>

            {/* form */}
            <form
              className="space-y-8 mt-14"
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
            >
              <div>
                <label className="block text-[12px] uppercase tracking-[0.18em] text-[#a19da2] font-semibold mb-4">
                  New Password
                </label>

                <div className="w-full h-16 rounded-2xl bg-[#eceaea] flex items-center px-5">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-lg text-[#5f6470] placeholder:text-[#5f6470]"
                  />
                  <LuEye className="text-2xl text-[#9b9aa2]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[0.18em] text-[#a19da2] font-semibold mb-4">
                  Confirm Password
                </label>

                <div className="w-full h-16 rounded-2xl bg-[#eceaea] flex items-center px-5">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-lg text-[#5f6470] placeholder:text-[#5f6470]"
                  />
                  <LuEye className="text-2xl text-[#9b9aa2]" />
                </div>
              </div>

              <div className="rounded-2xl bg-[#ece9e9] px-5 py-5">
                <p className="text-[12px] uppercase tracking-[0.16em] text-[#9d9ca2] font-semibold flex items-center gap-2">
                  <span>ⓘ</span> Security Check
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-[#6c6b72] text-lg">
                    {hasMinLength ? (
                      <LuCircleCheck className="text-xl text-green-500" />
                    ) : (
                      <LuCircle className="text-[#b4b3b9] text-xl" />
                    )}
                    <span>At least 8 characters long</span>
                  </div>

                  <div className="flex items-center gap-3 text-[#6c6b72] text-lg">
                    {hasSpecialAndNumber ? (
                      <LuCircleCheck className="text-xl text-green-500" />
                    ) : (
                      <LuCircle className="text-[#b4b3b9] text-xl" />
                    )}
                    <span>One special character &amp; number</span>
                  </div>
                </div>
              </div>
            {/* submit */}
              <button
                type="submit"
                className="w-full h-16 rounded-full bg-orange-500 text-white text-2xl font-semibold hover:bg-orange-600 transition shadow-[0_10px_20px_rgba(255,102,0,0.15)]"
              >
                Reset Password →
              </button>

              {message && (
                <p className="mt-4 text-sm text-center text-blue-600">{message}</p>
              )}
            </form>

            <div className="text-center mt-14">
              <Link
                to="/"
                className="text-[#635d63] text-xl hover:text-orange-500 transition"
              >
                ← Return to Login
              </Link>
            </div>

        </div>
      </div>
    </div>
  </div>
  );
}

export default ResetPassword;
