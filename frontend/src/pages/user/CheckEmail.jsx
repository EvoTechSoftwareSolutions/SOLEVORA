import { Link } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import checkImage from "../../assets/check-email.png";
import "../../styles/Auth.css";

function CheckEmail() {
  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left-panel">
        <img
          src={checkImage}
          alt="Check Email"
          className="auth-image"
        />
        <div className="auth-overlay"></div>
        <div className="auth-overlay-content">
          <p className="auth-tag">Solevora</p>
          <h1 className="auth-heading-img">
            The intersection of
            <br />
            high-performance &amp;
            <br />
            premium utility.
          </h1>
          <div style={{marginTop: "1.5rem", width: "3rem", height: "4px", backgroundColor: "#f97316", borderRadius: "2px"}}></div>
        </div>
      </div>

        {/* Right Side */}
        <div className="w-full md:w-[62%] bg-[#f5f5f5] flex items-center justify-center px-6 md:px-20 py-14">
          <div className="w-full max-w-md">
            <div className="w-20 h-20 rounded-full bg-[#fdf0e9] flex items-center justify-center">
              <HiOutlineMailOpen className="text-4xl text-orange-500" />
            </div>

          <h2 className="auth-title">
            Check your email
          </h2>

          <p className="auth-subtitle">
            We&apos;ve sent a password reset link to your registered email
            address. Please click the link in that email to reset your
            password.
          </p>

            <Link
              to="/"
              className="flex items-center justify-center w-full h-16 text-xl font-semibold text-white transition bg-orange-500 mt-14 rounded-2xl hover:bg-orange-600"
            >
              Back to Login →
            </Link>

            <p className="mt-8 text-base text-[#6a5d57]">
              Didn&apos;t receive the email?{" "}
              <span style={{fontWeight: "600", color: "#f97316", cursor: "pointer"}}>
                Resend Email
              </span>
            </p>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;