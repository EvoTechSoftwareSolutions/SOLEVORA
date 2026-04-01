import React, { useState } from "react";
import { Link } from "react-router-dom";

const SizeChart = () => {
    const [activeTab, setActiveTab] = useState("Men");

    const sizeData = {
        Men: [
            { uk: "6", us: "7", eu: "40", cm: "25.4" },
            { uk: "7", us: "8", eu: "41", cm: "26.2" },
            { uk: "8", us: "9", eu: "42", cm: "27.1" },
            { uk: "9", us: "10", eu: "43", cm: "27.9" },
            { uk: "10", us: "11", eu: "44", cm: "28.8" },
            { uk: "11", us: "12", eu: "45", cm: "29.6" },
            { uk: "12", us: "13", eu: "46", cm: "30.5" }
        ],
        Women: [
            { uk: "3", us: "5", eu: "36", cm: "22.5" },
            { uk: "4", us: "6", eu: "37", cm: "23.2" },
            { uk: "5", us: "7", eu: "38", cm: "24.1" },
            { uk: "6", us: "8", eu: "39", cm: "24.9" },
            { uk: "7", us: "9", eu: "40", cm: "25.8" },
            { uk: "8", us: "10", eu: "41", cm: "26.6" }
        ],
        Kids: [
            { uk: "10K", us: "11K", eu: "28", cm: "17.0" },
            { uk: "11K", us: "12K", eu: "29", cm: "17.8" },
            { uk: "12K", us: "13K", eu: "31", cm: "18.7" },
            { uk: "13K", us: "1", eu: "32", cm: "19.5" },
            { uk: "1", us: "2", eu: "33", cm: "20.2" }
        ]
    };

    return (
        <div className="bg-[#f2f0eb] min-h-screen py-20 px-6 font-primary">
            <div className="max-w-3xl mx-auto flex flex-col gap-12">
                
                {/* Hero */}
                <header className="text-center flex flex-col gap-4 animate-fadeIn">
                    <h1 className="text-5xl font-black text-secondary uppercase tracking-tighter leading-none italic">PERFECT <span className="text-primary italic">FIT</span></h1>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">Ensure your SoleVora experience is flawless. Use our global matrix to find your exact magnitude.</p>
                </header>

                {/* Size Card */}
                <main className="bg-white rounded-[2.5rem] shadow-2xl border border-black/5 p-10 flex flex-col gap-10 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <h3 className="text-xl font-black uppercase tracking-tight italic border-l-4 border-primary pl-4">Global Matrix</h3>
                        
                        {/* Tabs */}
                        <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 group">
                            {["Men", "Women", "Kids"].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 italic">
                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">UK Size</th>
                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">US Size</th>
                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">EU Size</th>
                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right px-2">Magnitude (CM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizeData[activeTab].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50 transition-colors group">
                                        <td className="py-5 px-2 text-sm font-black text-secondary group-hover:text-primary transition-colors">{row.uk}</td>
                                        <td className="py-5 px-2 text-sm font-bold text-gray-500">{row.us}</td>
                                        <td className="py-5 px-2 text-sm font-bold text-gray-500">{row.eu}</td>
                                        <td className="py-5 px-2 text-sm font-black text-secondary text-right italic">{row.cm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center mt-4 italic opacity-50">Note: Measurements are approximate. Fit may vary slightly between models.</p>
                </main>

                {/* CTA Card */}
                <section className="bg-secondary p-12 rounded-[2.5rem] text-center flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic mb-3">Still Unsure?</h2>
                        <p className="text-sm text-gray-400 font-medium italic max-w-sm mx-auto leading-relaxed">Our concierge team can help you find the perfect fit. Reach out for personalized guidance.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-md">
                        <Link to="/contact" className="flex-1 bg-primary text-white h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all">Get Advice</Link>
                        <Link to="/home" className="flex-1 bg-white/10 text-white h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">Back Home</Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SizeChart;
