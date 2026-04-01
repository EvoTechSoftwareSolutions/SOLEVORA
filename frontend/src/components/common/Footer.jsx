import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import footerLogo from '../../assets/logo.png';
import SuccessPopup from "./SuccessPoppup";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [popupType, setPopupType] = useState("success");

    const handleSubscribe = async () => {
        if (!email) {
            setMessage("Please enter your email");
            setPopupType("error");
            setShowPopup(true);
            return;
        }

        setLoading(true); 

        try {
            const res = await axios.post("http://localhost:5000/api/newsletter/subscribe", { email });
            setMessage(res.data.message || "Thank you for subscribing!");
            setShowPopup(true);
            setPopupType("success");
            setEmail("");
        } catch (err) {
            setMessage("Error subscribing. Please try again.");
            setPopupType("error");
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showPopup && (
                <SuccessPopup
                    message={message}
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                />
            )}
            <footer className="w-full bg-[#1A1A1A] text-white selection:bg-primary/30">
                
                {/* Newsletter Strip */}
                <div className="bg-primary/10 border-y border-white/5 py-12 px-6 md:px-12">
                    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left flex flex-col gap-2">
                            <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Join the <span className="text-primary">Echelon</span></h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Subscribe for early access drops and 10% off your next magnitude.</p>
                        </div>
                        <div className="w-full max-w-md flex bg-white/5 p-1 rounded-2xl border border-white/10 group focus-within:border-primary transition-all">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="flex-1 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-widest outline-none placeholder:text-gray-600"
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-[#c96c2a] transition-all shadow-lg active:scale-90"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 lg:py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <Link to="/" className="inline-block relative z-10">
                            <img src={footerLogo} alt="SoleVora Logo" className="h-10 transition-transform hover:scale-105" />
                        </Link>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed italic opacity-80 max-w-md">
                            Transcending traditional boundaries. Designing the future of performance footwear 
                            through high-fidelity craftsmanship and radical innovation.
                        </p>
                        <div className="flex flex-col gap-6">
                            {[
                                { icon: "location_on", text: "123 Velocity Blvd, Tech Sector, NY 10001" },
                                { icon: "call", text: "+1 (555) 888-0000" },
                                { icon: "mail", text: "hq@solevora.com" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-300 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined text-sm text-primary group-hover:text-white transition-colors">{item.icon}</span>
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Collection",
                                links: [
                                    { name: "New Arrivals", path: "/category?type=New" },
                                    { name: "Best Sellers", path: "/category?type=Best" },
                                    { name: "Running", path: "/category?type=Running" },
                                    { name: "Basketball", path: "/category?type=Basketball" }
                                ]
                            },
                            {
                                title: "Concierge",
                                links: [
                                    { name: "Track Order", path: "/track-order" },
                                    { name: "Find Fit", path: "/size-chart" },
                                    { name: "Return Center", path: "/returns" },
                                    { name: "Contact HQ", path: "/contact" }
                                ]
                            },
                            {
                                title: "Company",
                                links: [
                                    { name: "The Legacy", path: "/about" },
                                    { name: "Sustainability", path: "/eco" },
                                    { name: "Legal Hub", path: "/privacy-policy" },
                                    { name: "Careers", path: "/careers" }
                                ]
                            }
                        ].map((col, i) => (
                            <div key={i} className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{col.title}</h4>
                                <ul className="flex flex-col gap-4">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <Link to={link.path} className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white hover:translate-x-1 transition-all inline-block">{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legal & Social Bar */}
                <div className="border-t border-white/5 py-8 px-6 md:px-12 bg-black/20">
                    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">© 2026 SOLEVORA LABS. ALL REVOLUTIONS RESERVED.</p>
                        <div className="flex gap-4">
                            {[
                                { icon: "ri-instagram-line", label: "Instagram" },
                                { icon: "ri-twitter-x-line", label: "X" },
                                { icon: "ri-facebook-fill", label: "Facebook" }
                            ].map((social, i) => (
                                <Link 
                                    key={i} 
                                    to="#" 
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-secondary transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">circle</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
};

export default Footer;
