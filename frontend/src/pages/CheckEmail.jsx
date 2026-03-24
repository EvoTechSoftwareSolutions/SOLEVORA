import { Link } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import checkImage from "../assets/check-email.png";

function CheckEmail() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Left Side */}
        <div className="relative w-full md:w-[38%] h-[420px] md:h-screen">
          <img
            src={checkImage}
            alt="Check Email"
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-black/65"></div>

          <div className="absolute z-10 text-white bottom-12 left-8 md:left-14">
            <p className="text-[11px] uppercase tracking-[0.28em] text-orange-400 font-semibold">
              Solevora
            </p>

            <h1 className="max-w-sm mt-6 text-4xl font-bold leading-tight md:text-5xl">
              The intersection of
              <br />
              high-performance &amp;
              <br />
              premium utility.
            </h1>

            <div className="mt-8 w-12 h-[3px] bg-orange-500 rounded-full"></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[62%] bg-[#f5f5f5] flex items-center justify-center px-6 md:px-20 py-14">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-[#fdf0e9] flex items-center justify-center">
              <HiOutlineMailOpen className="text-4xl text-orange-500" />
            </div>

            <h2 className="mt-10 text-4xl md:text-5xl font-bold text-[#241815]">
              Check your email
            </h2>

            <p className="mt-6 text-[#685b55] text-lg leading-9 max-w-lg">
              We&apos;ve sent a password reset link to your registered email
              address. Please click the link in that email to reset your
              password.
            </p>

            <Link
  to="/reset-password"
  className="flex items-center justify-center w-full h-16 text-xl font-semibold text-white transition bg-orange-500 mt-14 rounded-2xl hover:bg-orange-600"
>
  Create New Password →
</Link>
            <p className="mt-8 text-base text-[#6a5d57]">
              Didn&apos;t receive the email?{" "}
              <span className="font-semibold text-orange-500 cursor-pointer">
                Resend Email
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;