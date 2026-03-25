import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

import footerLogo from "../../assets/image/footerlogo.png"; // keep your path

function Footer() {
  return (
    <footer className="bg-[#0c0c0c] text-white">

      {/* Newsletter */}
      <div className="border-b border-white/10">
        {/* 🔥 ONLY CHANGE → reduce gap slightly */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div>
            <h3 className="text-2xl font-semibold">Join the Future</h3>
            <p className="max-w-md mt-2 text-sm text-white/60">
              Subscribe for drops and 10% off your first order.
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 lg:w-auto sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-[320px] rounded-full bg-white text-[#222] px-5 py-3 outline-none"
            />
            <button className="rounded-full bg-[#f28b2f] hover:bg-[#de7c26] transition duration-300 px-6 py-3 font-medium">
              →
            </button>
          </div>

        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
        
        {/* Brand */}
        <div className="xl:col-span-2">

          {/* 🔥 ONLY CHANGE → increase logo size */}
          <img
            src={footerLogo}
            alt="Footer Logo"
            className="object-contain h-20 mb-5 md:h-24 lg:h-28"
          />

          <p className="max-w-md text-sm leading-7 text-white/60">
            Step into the future with cutting-edge footwear designed for
            comfort, performance, and elevated style.
          </p>

          <div className="mt-6 space-y-3 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker className="text-[#f28b2f]" size={18} />
              <span>123 Future Street, Tech City, TC 12345</span>
            </div>

            <div className="flex items-center gap-3">
              <HiOutlinePhone className="text-[#f28b2f]" size={18} />
              <span>(+1) 555 123 4567</span>
            </div>

            <div className="flex items-center gap-3">
              <HiOutlineMail className="text-[#f28b2f]" size={18} />
              <span>hello@solevora.com</span>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="mb-4 font-semibold">Shop</h4>
          <div className="space-y-3 text-sm text-white/60">
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              New Arrivals
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Best Sellers
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Running
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Lifestyle
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Basketball
            </Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 font-semibold">Support</h4>
          <div className="space-y-3 text-sm text-white/60">
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Contact Us
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              FAQs
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Shipping Info
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Returns
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Size Guide
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 font-semibold">Company</h4>
          <div className="space-y-3 text-sm text-white/60">
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              About Us
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Careers
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Press
            </Link>
            <Link to="/" className="block hover:text-[#f28b2f] transition">
              Sustainability
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          
          <p>© 2026 Solevora. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-[#f28b2f] transition">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-[#f28b2f] transition">
              Terms & Conditions
            </Link>
          </div>

          <div className="flex items-center gap-4 text-white/70">
            <a href="#" className="hover:text-[#f28b2f] transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-[#f28b2f] transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-[#f28b2f] transition">
              <FaFacebookF />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;