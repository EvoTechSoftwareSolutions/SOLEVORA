// ResetSuccess Component - Password reset success confirmation page
// Displays success message after successful password reset
// Provides navigation back to login page with visual confirmation
import { Link } from "react-router-dom";
import { LuCircleCheckBig } from "react-icons/lu";
import successImage from "../../assets/reset-success.png";

function ResetSuccess() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Left promotional panel */}
        <div className="relative w-full md:w-1/2 h-[420px] md:h-screen">
          {/* Success background image */}
          <img
            src={successImage}
            alt="Password Reset Success"
            className="object-cover w-full h-full"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-black/35"></div>

          {/* Promotional content */}
          <div className="absolute z-10 text-white left-8 md:left-14 bottom-14">
            <div className="inline-block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] bg-orange-500 rounded-full">
              Limited Edition
            </div>

            <p className="max-w-md mt-8 text-lg leading-9 text-gray-200 md:text-xl">
              Redefining the pace of modern retail with curated
              precision and kinetic energy.
            </p>
          </div>
        </div>

        {/* Right success message panel */}
        <div className="relative w-full md:w-1/2 bg-[#f4f4f4] flex items-center justify-center px-6 md:px-16 py-12">
          <div className="w-full max-w-md text-center md:text-left">
            {/* Success icon with visual confirmation */}
            <div className="w-28 h-28 mx-auto md:mx-0 rounded-full bg-[#fdf3ee] flex items-center justify-center shadow-sm">
              <LuCircleCheckBig className="text-6xl text-orange-500" />
            </div>

            {/* Success message title */}
            <h2 className="mt-12 text-4xl md:text-5xl font-bold text-[#241815] leading-tight">
              Password Reset
              <br />
              Successful
            </h2>

            {/* Success message description */}
            <p className="mt-6 text-[#685b55] text-lg md:text-xl leading-9 max-w-lg">
              Your password has been successfully updated. You can now use your new
              password to log in to your account.
            </p>

            {/* Back to login button */}
            <Link
              to="/"
              className="mt-12 w-full h-16 rounded-2xl bg-orange-500 text-white text-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center shadow-[0_10px_20px_rgba(255,102,0,0.15)]"
            >
              Back to Login →
            </Link>
          </div>

          {/* Decorative star elements for visual appeal */}
          <div className="absolute hidden right-10 bottom-10 opacity-40 md:block">
            <div className="relative w-32 h-32">
              <div className="absolute top-0 right-0 text-5xl text-orange-100">✦</div>
              <div className="absolute text-orange-100 left-6 bottom-6 text-7xl">✧</div>
              <div className="absolute bottom-0 text-4xl text-orange-100 right-4">✦</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetSuccess; // Export ResetSuccess component