import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";

import logo from "../../assets/image/logo.png";  

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Category", path: "/category" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm h-[70px] md:h-[80px] flex items-center justify-between px-6 md:px-12 lg:px-20 relative z-50">

      {/* ================= LOGO ================= */}
      <div className="flex items-center h-full overflow-visible">
        <img
          src={logo}
          alt="logo"
          className="object-contain h-20 -my-4 md:h-24 lg:h-28 md:-my-6" 
        />
      </div>

      {/* ================= CENTER MENU ================= */}
      <ul className="absolute items-center hidden gap-10 transform -translate-x-1/2 md:flex lg:gap-14 left-1/2">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`text-[16px] lg:text-[18px] font-medium transition ${
                location.pathname === item.path
                  ? "text-[#e58a45]"
                  : "text-[#333] hover:text-[#e58a45]"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* ================= RIGHT ICONS ================= */}
      <div className="items-center hidden gap-6 md:flex md:gap-8 lg:gap-10">
        <HiOutlineShoppingCart className="text-[24px] md:text-[26px] lg:text-[28px] cursor-pointer hover:text-[#e58a45] transition" />
        <HiOutlineUser className="text-[24px] md:text-[26px] lg:text-[28px] cursor-pointer hover:text-[#e58a45] transition" />
        <HiOutlineHeart className="text-[24px] md:text-[26px] lg:text-[28px] cursor-pointer hover:text-[#e58a45] transition" />
      </div>

      {/* ================= MOBILE BUTTON ================= */}
      <button
        className="md:hidden text-[#333]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
      </button>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`absolute top-[100%] left-0 w-full bg-white shadow-md transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-[400px] py-6" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center gap-6">
          {menu.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`text-[16px] font-medium ${
                  location.pathname === item.path
                    ? "text-[#e58a45]"
                    : "text-[#333]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <HiOutlineShoppingCart className="text-[26px]" />
          <HiOutlineUser className="text-[26px]" />
          <HiOutlineHeart className="text-[26px]" />
        </div>
      </div>

    </nav>
  );
}

export default Navbar;