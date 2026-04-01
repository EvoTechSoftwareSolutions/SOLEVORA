import React, { useState } from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";
import { 
    FaFacebookF, 
    FaTwitter, 
    FaInstagram, 
    FaLinkedinIn 
} from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import decorationImg from "../../assets/image/Adidas.png";

const Contact = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            e.target.reset();
            setTimeout(() => setShowSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="flex flex-col w-full bg-white font-poppins relative overflow-hidden">
            
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed top-24 right-5 z-[999] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight">
                    <span className="material-symbols-outlined font-black">check_circle</span>
                    <span className="font-bold text-sm">Message sent! We'll get back to you soon.</span>
                </div>
            )}

            {/* Hero Banner Section */}
            <section className="relative w-full h-[450px] lg:h-[550px] flex items-center lg:justify-end px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-white to-accent-orange/20">
                <div className="absolute left-[-10%] bottom-0 w-[80%] h-full pointer-events-none z-10 animate-fadeIn opacity-40 lg:opacity-100">
                    <img src={decorationImg} alt="Decoration" className="w-full h-full object-contain object-left-bottom" />
                </div>
                <div className="relative z-20 text-center lg:text-right max-w-xl flex flex-col gap-4 animate-fadeIn mx-auto lg:mx-0">
                    <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-secondary leading-none uppercase italic tracking-tighter">GET IN <span className="text-primary italic">TOUCH</span></h1>
                    <p className="text-sm md:text-lg text-gray-500 font-medium italic max-w-md ml-auto">Have a concern or just want to talk kicks? Our team is ready to assist you 24/7 with premium concierge support.</p>
                </div>
            </section>

            {/* Contact Grid Section */}
            <section className="bg-bg-light py-20 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left: Contact Info & Map */}
                <div className="lg:col-span-6 flex flex-col gap-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { icon: <FaPhoneAlt />, label: "Call Us", value: "+1 (555) 000-0000", sub: "Mon-Fri, 9am-6pm" },
                            { icon: <FaEnvelope />, label: "Email Us", value: "hello@solevora.com", sub: "Response within 24h" },
                            { icon: <FaMapMarkerAlt />, label: "Visit Store", value: "45 Shoe St, NY 10001", sub: "Flagship Showroom" },
                            { icon: <FaClock />, label: "Support", value: "24/7 Priority", sub: "For Premium Members" }
                        ].map((item, i) => (
                            <div key={i} className="bg-accent-yellow/10 p-8 rounded-3xl border border-primary/5 flex flex-col gap-4 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className="text-secondary text-2xl group-hover:text-primary transition-colors">{item.icon}</div>
                                <div>
                                    <h5 className="text-sm font-black uppercase tracking-widest leading-none mb-1">{item.label}</h5>
                                    <span className="text-sm font-bold block">{item.value}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 block tracking-tighter">{item.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-accent-yellow/10 p-8 rounded-[2.5rem] flex flex-col gap-6">
                        <h5 className="text-xl font-black uppercase tracking-tight">Find Our <span className="text-primary italic">Lair</span></h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium italic">Located at the heart of the fashion district, our flagship store is more than a shop — it's an experience.</p>
                        <div className="rounded-3xl overflow-hidden h-[300px] shadow-lg border-4 border-white ring-1 ring-black/5">
                            <iframe 
                                title="SoleVora Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1679901000000!5m2!1sen!2s" 
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    <div className="bg-accent-yellow/10 p-8 rounded-[2.5rem] flex flex-col gap-6">
                        <h5 className="text-xl font-black uppercase tracking-tight">Social <span className="text-primary italic">Connect</span></h5>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Follow us for exclusive drops, early bird sales, and community events.</p>
                        <div className="flex gap-4">
                            {[<FaFacebookF />, <FaTwitter />, <FaInstagram />, <FaLinkedinIn />].map((icon, i) => (
                                <button key={i} className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center text-lg hover:bg-primary hover:scale-110 transition-all shadow-lg active:scale-95">
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Contact Form */}
                <div className="lg:col-span-6 sticky top-24">
                    <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-black/5 flex flex-col gap-8 animate-fadeIn">
                        <div>
                            <h4 className="text-3xl font-black uppercase tracking-tighter italic">Send a <span className="text-primary">Flare</span></h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Personalized support within minutes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                                <input type="text" placeholder="ALEX MERCER" required className="h-14 px-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                <input type="email" placeholder="ALEX@EXAMPLE.COM" required className="h-14 px-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm tracking-wide uppercase" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Subject</label>
                            <select className="h-14 px-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm appearance-none cursor-pointer">
                                <option>Order Status Inquiry</option>
                                <option>Product Feedback</option>
                                <option>Wholesale/Partnership</option>
                                <option>Technical Issue</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                            <textarea placeholder="WHAT'S ON YOUR MIND?" required className="h-40 p-6 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-sm resize-none" />
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="h-16 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-2xl shadow-primary/20 active:scale-95 disabled:opacity-50 group"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">LAUNCHING...</span>
                            ) : (
                                <>
                                    <span>SEND MESSAGE</span>
                                    <RiSendPlaneFill className="text-xl group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </section>

        </div>
    );
};

export default Contact;
