
import React, { useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Settings.css';

// Small standalone "Change Password" page accessible to all dashboard roles

const SecurityPage = () => {
    const { adminUser } = useAdminAuth();

    const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwErrors, setPwErrors] = useState({});
    const [isPwSaving, setIsPwSaving] = useState(false);
    const [toast, setToast]       = useState(null);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw]         = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Password strength: 1=weak 2=fair 3=good 4=strong
    const pwStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8)  score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
        return Math.min(score, 4);
    };

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

    const eyeBtnStyle = {
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
    };
    const errStyle = { fontSize: 11, color: '#ef4444', marginTop: 2 };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!pwForm.currentPassword)              errs.currentPassword = 'Current password is required';
        if (!pwForm.newPassword)                  errs.newPassword = 'New password is required';
        else if (pwForm.newPassword.length < 8)   errs.newPassword = 'Password must be at least 8 characters';
        if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        if (Object.keys(errs).length) { setPwErrors(errs); return; }
        setPwErrors({});
        setIsPwSaving(true);
        try {
            await axios.put(`http://localhost:5001/user/${adminUser.id}/password`, {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showToast('Password changed successfully! Use your new password next time you log in.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update password';
            if (msg.toLowerCase().includes('incorrect')) {
                setPwErrors({ currentPassword: 'Current password is incorrect' });
            } else {
                showToast(msg, 'error');
            }
        } finally {
            setIsPwSaving(false);
        }
    };

    return (
        <div className="st-root">
            {/* Toast */}
            {toast && (
                <div className={`st-toast ${toast.type === 'error' ? 'st-toast-error' : 'st-toast-success'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Page header */}
            <div className="st-page-header">
                <div>
                    <h1 className="st-page-title">🔐 Security</h1>
                    <p className="st-page-sub">Update your management portal password</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(246,109,59,0.08), rgba(249,115,22,0.08))',
                    border: '1px solid rgba(246,109,59,0.2)',
                    borderRadius: 12,
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f66d3b, #f97316)',
                        color: '#fff', fontWeight: 700, fontSize: 15,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {adminUser?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{adminUser?.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{adminUser?.role === 'admin' ? 'System Admin' : 'Store Manager'}</div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 520 }}>
                <div className="st-content">
                    <form className="st-form" onSubmit={handleSubmit}>
                        <div className="st-section-title">Change Your Password</div>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 22, marginTop: -8 }}>
                            Update the password you use to access this management portal. You will need your current password to confirm the change.
                        </p>

                        {/* Current Password */}
                        <div className="st-field">
                            <label>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showCurrentPw ? 'text' : 'password'}
                                    placeholder="Enter your current password"
                                    value={pwForm.currentPassword}
                                    onChange={e => { setPwForm(p => ({ ...p, currentPassword: e.target.value })); setPwErrors(p => ({ ...p, currentPassword: '' })); }}
                                    style={{ paddingRight: 40, borderColor: pwErrors.currentPassword ? '#ef4444' : '' }}
                                />
                                <button type="button" onClick={() => setShowCurrentPw(v => !v)} style={eyeBtnStyle}>
                                    {showCurrentPw ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {pwErrors.currentPassword && <span style={errStyle}>{pwErrors.currentPassword}</span>}
                        </div>

                        {/* New Password */}
                        <div className="st-field">
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showNewPw ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    value={pwForm.newPassword}
                                    onChange={e => { setPwForm(p => ({ ...p, newPassword: e.target.value })); setPwErrors(p => ({ ...p, newPassword: '' })); }}
                                    style={{ paddingRight: 40, borderColor: pwErrors.newPassword ? '#ef4444' : '' }}
                                />
                                <button type="button" onClick={() => setShowNewPw(v => !v)} style={eyeBtnStyle}>
                                    {showNewPw ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {pwErrors.newPassword && <span style={errStyle}>{pwErrors.newPassword}</span>}

                            {/* Strength indicator */}
                            {pwForm.newPassword && (
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{
                                                height: 5, flex: 1, borderRadius: 4,
                                                background: pwStrength(pwForm.newPassword) >= i
                                                    ? strengthColor[pwStrength(pwForm.newPassword)]
                                                    : '#e5e7eb',
                                                transition: 'background 0.3s',
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 11, color: strengthColor[pwStrength(pwForm.newPassword)], marginTop: 4, display: 'block', fontWeight: 600 }}>
                                        {strengthLabel[pwStrength(pwForm.newPassword)]} password
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="st-field">
                            <label>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    placeholder="Repeat your new password"
                                    value={pwForm.confirmPassword}
                                    onChange={e => { setPwForm(p => ({ ...p, confirmPassword: e.target.value })); setPwErrors(p => ({ ...p, confirmPassword: '' })); }}
                                    style={{ paddingRight: 40, borderColor: pwErrors.confirmPassword ? '#ef4444' : '' }}
                                />
                                <button type="button" onClick={() => setShowConfirmPw(v => !v)} style={eyeBtnStyle}>
                                    {showConfirmPw ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {pwErrors.confirmPassword && <span style={errStyle}>{pwErrors.confirmPassword}</span>}
                            {/* Match indicator */}
                            {pwForm.confirmPassword && pwForm.newPassword && (
                                <span style={{ fontSize: 11, marginTop: 2, display: 'block', fontWeight: 600, color: pwForm.newPassword === pwForm.confirmPassword ? '#10b981' : '#ef4444' }}>
                                    {pwForm.newPassword === pwForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </span>
                            )}
                        </div>

                        {/* Tip */}
                        <div className="st-info-box" style={{ marginTop: 4 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            Use at least <strong>8 characters</strong> mixing uppercase, lowercase, numbers &amp; symbols for the strongest protection.
                        </div>

                        {/* Actions */}
                        <div className="st-form-actions" style={{ gap: 10 }}>
                            <button
                                type="button"
                                className="st-btn-secondary"
                                onClick={() => { setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPwErrors({}); }}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="st-btn-primary"
                                disabled={isPwSaving}
                            >
                                {isPwSaving ? 'Updating…' : '🔒 Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
