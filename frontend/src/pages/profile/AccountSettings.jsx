import React, { useMemo, useState } from 'react';
import { MdOutlineAccountCircle, MdOutlineShield, MdOutlineNotificationsNone, MdOutlineContactMail, MdOutlineVpnKey, MdOutlineFingerprint, MdDeleteOutline, MdArrowForward } from "react-icons/md";
import axios from 'axios';

const AccountSettings = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [username, setUsername] = useState(user?.username || "Vora_User_01");
    const userId = user?.id;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMessage, setPwMessage] = useState(null); // { type: 'success'|'error', text: string }

    const canSubmitPassword = useMemo(() => {
        if (!userId) return false;
        if (!currentPassword || !newPassword || !confirmPassword) return false;
        if (newPassword !== confirmPassword) return false;
        if (newPassword.length < 6) return false;
        return true;
    }, [userId, currentPassword, newPassword, confirmPassword]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPwMessage(null);

        if (!userId) {
            setPwMessage({ type: 'error', text: 'Please log in again to change your password.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwMessage({ type: 'error', text: 'New password and confirm password do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setPwMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setPwLoading(true);
        try {
            const resp = await axios.put(`http://localhost:5000/user/${userId}/password`, {
                currentPassword,
                newPassword,
            });
            setPwMessage({ type: 'success', text: resp.data?.message || 'Password updated successfully.' });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPwMessage({ type: 'error', text: err?.response?.data?.message || 'Password update failed. Please try again.' });
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 animate-fadeIn relative z-10 selection:bg-primary/20 italic">
            
            {/* Header */}
            <header>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-secondary italic leading-none">IDENTITY <span className="text-primary italic">MATRIX</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.3em] mt-3">Personal Intelligence Management • Global Node #772</p>
            </header>

            {/* Profile Matrix Card */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm flex flex-col gap-10 group transition-all duration-500 hover:shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MdOutlineAccountCircle size={28} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary italic">Core Identity Profile</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">Legal Identity Designation</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">Neural Endpoint (Email)</label>
                        <input 
                            type="email" 
                            disabled
                            value={email} 
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-xs uppercase tracking-widest opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">System Alias</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                 </div>

                 <div className="flex justify-end pt-4 border-t border-slate-50">
                    <button className="px-10 h-14 bg-secondary text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-secondary/10 active:scale-95 flex items-center gap-3">
                        Commit Integration
                        <MdArrowForward size={18} />
                    </button>
                 </div>
            </section>

            {/* Security Protocol Card */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm flex flex-col gap-10 group transition-all duration-500 hover:shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <MdOutlineShield size={28} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary italic">Security Access Protocols</h3>
                 </div>

                 <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <MdOutlineFingerprint size={24} />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Two-Factor Authentication</h4>
                            <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest opacity-60">Status: Active • Biometric Override Enabled</p>
                         </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                 </div>

                 <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">Current password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs"
                        />
                     </div>

                     <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs"
                        />
                     </div>

                     <div className="flex flex-col gap-2 group/input">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within/input:text-primary transition-colors">Confirm new password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-bold text-xs"
                        />
                     </div>

                     <div className="flex flex-col justify-end gap-3">
                        {pwMessage && (
                            <div
                                className={`text-[10px] font-black uppercase tracking-widest px-5 py-4 rounded-2xl border ${
                                    pwMessage.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}
                                role="status"
                            >
                                {pwMessage.text}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!canSubmitPassword || pwLoading}
                            className="px-10 h-14 bg-secondary text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-secondary/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {pwLoading ? 'Updating…' : 'Update password'}
                            <MdArrowForward size={18} />
                        </button>
                     </div>
                 </form>
            </section>

            {/* Logistics & System Prefs */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm flex flex-col gap-10 group transition-all duration-500 hover:shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <MdOutlineNotificationsNone size={28} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary italic">Propagation Preferences</h3>
                 </div>

                 <div className="flex flex-col gap-4">
                    {[
                        { title: 'Magnitude Updates', desc: 'Secure alerts on limited quantity drops.', icon: <MdOutlineContactMail /> },
                        { title: 'Direct Transmission (SMS)', desc: 'Mobile coordinate tracking synchronization.', icon: <MdOutlineVpnKey /> }
                    ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-gray-400">{pref.icon}</div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">{pref.title}</h4>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest opacity-60 mt-0.5">{pref.desc}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked={i===0} />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    ))}
                 </div>
            </section>

            {/* Termination Zone */}
            <section className="bg-rose-50/50 rounded-[2.5rem] border border-rose-100 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white border border-rose-100 text-rose-500 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <MdDeleteOutline size={32} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">Identity Termination</h4>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest opacity-80 mt-1">Erase all magnitude logs and encrypted identity tokens.</p>
                    </div>
                 </div>
                 <button className="px-10 h-12 bg-white text-rose-500 border border-rose-100 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 italic">Initialize Termination</button>
            </section>

            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[.3em] opacity-50 pb-8 italic">Identity Matrix Control v2.6 • SoleVora Network</p>

        </div>
    );
};

export default AccountSettings;
