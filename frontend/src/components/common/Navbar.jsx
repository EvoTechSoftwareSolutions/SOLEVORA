import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Category", path: "/category" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" }
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
            <nav className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="relative z-[1001]">
                    <img src={logo} alt="SoleVora Logo" className="h-8 md:h-10 transition-transform hover:scale-110 active:scale-95" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group ${location.pathname === link.path ? 'text-primary' : 'text-secondary'}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 relative z-[1001]">
                    <Link to="/cart" className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                    </Link>
                    
                    <div className="hidden sm:flex items-center gap-2">
                        <Link to={user ? "/profile" : "/login"} className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[22px]">person</span>
                        </Link>
                        <Link to={user ? "/profile/wishlist" : "/login"} className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[22px]">favorite</span>
                        </Link>
                        {user && (
                            <Link to="/logout" className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-rose-500 hover:text-white transition-all" title="Logout">
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[24px]">{menuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-[1000] flex flex-col items-center justify-center gap-10 transition-all duration-700 lg:hidden ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className="text-4xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex gap-6 mt-10">
                        <Link to={user ? "/profile" : "/login"} onClick={() => setMenuOpen(false)} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                            <span className="material-symbols-outlined text-2xl">person</span>
                        </Link>
                        <Link to={user ? "/profile/wishlist" : "/login"} onClick={() => setMenuOpen(false)} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                            <span className="material-symbols-outlined text-2xl">favorite</span>
                        </Link>
                        {user && (
                            <Link to="/logout" onClick={() => setMenuOpen(false)} className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined text-2xl">logout</span>
                            </Link>
                        )}
                    </div>
                </div>

            </nav>
        </header>
    );
};

export default Navbar;
