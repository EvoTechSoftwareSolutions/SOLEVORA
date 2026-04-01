import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineArrowBack, MdOutlineLocationOn, MdOutlineCheckCircle, MdOutlineFiberManualRecord } from "react-icons/md";

const AddAddress = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Home',
        isDefault: false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.email) return;
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/addresses', {
                ...formData,
                email: user.email,
            });
            navigate('/profile/addresses');
        } catch (error) {
            console.error("Coordinate injection failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10 animate-fadeIn relative z-10 selection:bg-primary/20 italic max-w-4xl mx-auto">
            
            {/* Header */}
            <header className="flex flex-col gap-6">
                <Link to="/profile/addresses" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all group w-fit">
                    <MdOutlineArrowBack size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Logistics Hub
                </Link>
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">INJECT <span className="text-primary italic">COORDINATES</span></h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Establishing New Delivery Endpoint • Precision Protocol</p>
                </div>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm flex flex-col gap-10 group transition-all duration-500 hover:shadow-2xl">
                 
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MdOutlineLocationOn size={28} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary italic">Endpoint Specification</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { label: 'Recipient Identity', name: 'fullName', type: 'text', placeholder: 'FULL LEGAL NAME' },
                        { label: 'Comm-Link Number', name: 'phoneNumber', type: 'tel', placeholder: '+1 ••• ••• ••••' },
                        { label: 'Surface Address', name: 'streetAddress', type: 'text', placeholder: 'STREET / BUILDING / SUITE', full: true },
                        { label: 'Sector (City)', name: 'city', type: 'text', placeholder: 'CITY NAME' },
                        { label: 'Territory (State)', name: 'state', type: 'text', placeholder: 'STATE / PROVINCE' },
                        { label: 'Zone Index (Zip)', name: 'zipCode', type: 'text', placeholder: 'POSTAL CODE' },
                    ].map((field) => (
                        <div key={field.name} className={`flex flex-col gap-2 group/input ${field.full ? 'md:col-span-2' : ''}`}>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">{field.label}</label>
                            <input 
                                type={field.type} 
                                required
                                placeholder={field.placeholder}
                                value={formData[field.name]} 
                                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                            />
                        </div>
                    ))}

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Endpoint Topology</label>
                        <div className="flex gap-4">
                            {['Home', 'Office', 'Tactical'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({...formData, type})}
                                    className={`flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all italic border ${formData.type === type ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-slate-50 text-gray-400 border-transparent hover:bg-slate-100'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* Checkbox */}
                 <div className="flex items-center gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer group/check" onClick={() => setFormData({...formData, isDefault: !formData.isDefault})}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.isDefault ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white border-2 border-slate-200'}`}>
                        {formData.isDefault && <MdOutlineCheckCircle size={18} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary group-hover/check:text-primary transition-colors">Designate as Primary Vector</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Automate all future delivery deployments to this coordinate.</span>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-50">
                    <button type="button" onClick={() => navigate('/profile/addresses')} className="px-10 h-14 bg-white border border-slate-100 text-gray-400 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">Cancel Protocol</button>
                    <button type="submit" disabled={loading} className="px-12 h-14 bg-black text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50">
                        {loading ? 'Transmitting...' : 'Commit Coordinates'}
                    </button>
                 </div>
            </form>

            <div className="flex items-center justify-center gap-4 opacity-50 pb-8">
                 <MdOutlineFiberManualRecord className="text-primary animate-pulse text-[8px]" />
                 <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[.4em] italic">Precision Grid Synchronization Active</p>
                 <MdOutlineFiberManualRecord className="text-primary animate-pulse text-[8px]" />
            </div>

        </div>
    );
};

export default AddAddress;
