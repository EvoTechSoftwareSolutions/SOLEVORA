import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import './AdminLogin.css';
import { API_URL, BASE_URL, getImageUrl } from '../config/api';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
            setMessage(res.data.message);
            
            // Redirect to admin login after a bit if success
            setTimeout(() => {
                navigate('/admin-login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="al-root">
            <div className="al-bg-blob al-blob1" />
            <div className="al-bg-blob al-blob2" />

            <div className="al-card">
                <div className="al-logo-wrap">
                    <img src={logo} alt="SoleVora" className="al-logo" />
                </div>

                <div className="al-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Security Recovery
                </div>

                <h1 className="al-title">Forgot Password</h1>
                <p className="al-subtitle">Enter your email address and we'll send you a link to reset your management portal access.</p>

                <form className="al-form" onSubmit={handleSubmit}>
                    <div className="al-field">
                        <label className="al-label">Email Address</label>
                        <div className="al-input-wrap">
                            <svg className="al-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <input
                                type="email"
                                className="al-input"
                                placeholder="name@solevora.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="al-error">{error}</div>}
                    {message && <div style={{ color: '#34d399', fontSize: '13px', textAlign: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px' }}>{message}</div>}

                    <button type="submit" className="al-submit" disabled={loading}>
                        {loading ? <span className="al-spinner" /> : 'Send Reset Link →'}
                    </button>
                </form>

                <p className="al-back-link" onClick={() => navigate('/admin-login')}>
                    ← Back to Admin Login
                </p>
            </div>
        </div>
    );
};

export default AdminForgotPassword;
