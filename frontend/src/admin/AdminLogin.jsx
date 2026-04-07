import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../assets/logo.png';
import './AdminLogin.css';
// Admin Login Component
const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please enter email and password'); return; }

        setLoading(true);
        try {
            // Send login request to backend
            const res = await axios.post('http://localhost:5000/admin-login', { email, password });
            login(res.data.user);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="al-root">
            {/* Background decoration */}
            <div className="al-bg-blob al-blob1" />
            <div className="al-bg-blob al-blob2" />

            <div className="al-card">
                {/* Logo */}
                <div className="al-logo-wrap">
                    <img src={logo} alt="SoleVora" className="al-logo" />
                </div>

                <div className="al-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Admin &amp; Store Manager Portal
                </div>

                <h1 className="al-title">Welcome Back</h1>
                <p className="al-subtitle">Sign in to access the SoleVora management panel</p>

                <form className="al-form" onSubmit={handleSubmit}>
                    <div className="al-field">
                        <label className="al-label">Email Address</label>
                        <div className="al-input-wrap">
                            <svg className="al-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <input
                                id="admin-email"
                                type="email"
                                className="al-input"
                                placeholder="admin@solevora.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    {/* Password Field */}
                    <div className="al-field">
                        <label className="al-label">Password</label>
                        <div className="al-input-wrap">
                            <svg className="al-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input
                                id="admin-password"
                                type="password"
                                className="al-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && <div className="al-error">{error}</div>}

                    <button id="admin-login-btn" type="submit" className="al-submit" disabled={loading}>
                          {/* Show spinner when loading */}
                        {loading
                            ? <span className="al-spinner" />
                            : <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                                </svg>
                                Sign In to Dashboard
                            </>
                        }
                    </button>
                </form>

                <div className="al-roles-info">
                    <div className="al-role-chip al-role-admin">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        System Admin
                    </div>
                    <div className="al-role-chip al-role-manager">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M12 12h.01"/></svg>
                        Store Manager
                    </div>
                </div>
 {/* Back to user login */}
                <p className="al-back-link" onClick={() => navigate('/login')}>
                    ← Back to Customer Login
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
