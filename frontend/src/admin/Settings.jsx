import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Settings.css';

const API = 'http://localhost:5000/api/admin';

// ── Helper: API headers with admin id ────────────────────────────────────────
const authHeaders = (adminUser) => ({ 'x-admin-id': adminUser?.id });

// ══════════════════════════════════════════════════════════════════════════════
// Settings Page Component
// ══════════════════════════════════════════════════════════════════════════════
const Settings = () => {
    const { adminUser, isAdmin } = useAdminAuth();

    const [activeTab, setActiveTab] = useState('store');
    const [settings, setSettings] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Staff modal state
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'store_manager' });

    // ── Load data ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const [settingsRes, staffRes] = await Promise.all([
                    axios.get(`${API}/settings`,     { headers: authHeaders(adminUser) }),
                    axios.get(`${API}/admin-users`,  { headers: authHeaders(adminUser) })
                ]);
                setSettings(settingsRes.data);
                setStaffList(staffRes.data);
            } catch (err) {
                showToast(err.response?.data?.message || 'Failed to load settings', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [adminUser]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Save system settings ──────────────────────────────────────────────────
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API}/settings`, settings, { headers: authHeaders(adminUser) });
            showToast('Settings saved successfully!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Staff management ──────────────────────────────────────────────────────
    const openNewStaff = () => {
        setEditingStaff(null);
        setStaffForm({ name: '', email: '', password: '', role: 'store_manager' });
        setShowStaffModal(true);
    };

    const openEditStaff = (member) => {
        setEditingStaff(member);
        setStaffForm({ name: member.name, email: member.email, password: '', role: member.role });
        setShowStaffModal(true);
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingStaff) {
                const res = await axios.put(`${API}/admin-users/${editingStaff.id}`, staffForm, { headers: authHeaders(adminUser) });
                setStaffList(prev => prev.map(m => m.id === editingStaff.id ? { ...m, ...res.data.user } : m));
                showToast('Staff member updated');
            } else {
                const res = await axios.post(`${API}/admin-users`, staffForm, { headers: authHeaders(adminUser) });
                const refreshed = await axios.get(`${API}/admin-users`, { headers: authHeaders(adminUser) });
                setStaffList(refreshed.data);
                showToast('Staff member created');
            }
            setShowStaffModal(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Remove this staff member?')) return;
        try {
            await axios.delete(`${API}/admin-users/${id}`, { headers: authHeaders(adminUser) });
            setStaffList(prev => prev.filter(m => m.id !== id));
            showToast('Staff member removed');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete', 'error');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) return <div className="st-loading"><div className="st-spinner" /></div>;

    const TABS = [
        { id: 'store',    label: 'Store',   icon: '🏪' },
        { id: 'shipping', label: 'Shipping', icon: '📦' },
        { id: 'staff',    label: 'Staff',    icon: '👥' },
    ];

    return (
        <div className="st-root">
            {/* Toast */}
            {toast && (
                <div className={`st-toast ${toast.type === 'error' ? 'st-toast-error' : 'st-toast-success'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Modal */}
            {showStaffModal && (
                <div className="st-modal-overlay" onClick={() => setShowStaffModal(false)}>
                    <div className="st-modal" onClick={e => e.stopPropagation()}>
                        <div className="st-modal-header">
                            <h3>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                            <button className="st-modal-close" onClick={() => setShowStaffModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleStaffSubmit} className="st-modal-form">
                            <div className="st-field">
                                <label>Full Name</label>
                                <input required value={staffForm.name} onChange={e => setStaffForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" />
                            </div>
                            <div className="st-field">
                                <label>Email</label>
                                <input required type="email" value={staffForm.email} onChange={e => setStaffForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@solevora.com" />
                            </div>
                            <div className="st-field">
                                <label>{editingStaff ? 'New Password (leave blank to keep)' : 'Password'}</label>
                                <input type="password" required={!editingStaff} value={staffForm.password} onChange={e => setStaffForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                            </div>
                            <div className="st-field">
                                <label>Role</label>
                                <select value={staffForm.role} onChange={e => setStaffForm(p => ({ ...p, role: e.target.value }))}>
                                    <option value="store_manager">Store Manager</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                            <div className="st-modal-actions">
                                <button type="button" className="st-btn-secondary" onClick={() => setShowStaffModal(false)}>Cancel</button>
                                <button type="submit" className="st-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Page header */}
            <div className="st-page-header">
                <div>
                    <h1 className="st-page-title">System Settings</h1>
                    <p className="st-page-sub">Configure your store, shipping policies, and manage your team</p>
                </div>
            </div>

            <div className="st-layout">
                {/* Tab nav */}
                <nav className="st-tabs">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`st-tab ${activeTab === t.id ? 'st-tab-active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            <span>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </nav>

                <div className="st-content">
                    {/* ── Store Settings ────────────────────────────────────── */}
                    {activeTab === 'store' && settings && (
                        <form className="st-form" onSubmit={handleSaveSettings}>
                            <div className="st-section-title">Store Information</div>
                            <div className="st-grid-2">
                                <div className="st-field">
                                    <label>Store Name</label>
                                    <input value={settings.storeName || ''} onChange={e => setSettings(p => ({ ...p, storeName: e.target.value }))} />
                                </div>
                                <div className="st-field">
                                    <label>Store Email</label>
                                    <input type="email" value={settings.storeEmail || ''} onChange={e => setSettings(p => ({ ...p, storeEmail: e.target.value }))} />
                                </div>
                                <div className="st-field">
                                    <label>Store Phone</label>
                                    <input value={settings.storePhone || ''} onChange={e => setSettings(p => ({ ...p, storePhone: e.target.value }))} />
                                </div>
                                <div className="st-field">
                                    <label>Currency</label>
                                    <select value={settings.storeCurrency || 'LKR'} onChange={e => setSettings(p => ({ ...p, storeCurrency: e.target.value }))}>
                                        <option value="LKR">LKR – Sri Lankan Rupee</option>
                                        <option value="USD">USD – US Dollar</option>
                                        <option value="EUR">EUR – Euro</option>
                                        <option value="GBP">GBP – British Pound</option>
                                    </select>
                                </div>
                                <div className="st-field">
                                    <label>Low Stock Alert Threshold</label>
                                    <input type="number" min="1" value={settings.lowStockThreshold ?? 20} onChange={e => setSettings(p => ({ ...p, lowStockThreshold: parseInt(e.target.value) }))} />
                                </div>
                            </div>

                            <div className="st-section-title" style={{ marginTop: 28 }}>Features</div>
                            <div className="st-toggles">
                                <label className="st-toggle-row">
                                    <div>
                                        <div className="st-toggle-label">Maintenance Mode</div>
                                        <div className="st-toggle-desc">Temporarily disable the storefront for customers</div>
                                    </div>
                                    <div className={`st-toggle ${settings.maintenanceMode ? 'st-toggle-on' : ''}`} onClick={() => setSettings(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}>
                                        <div className="st-toggle-thumb" />
                                    </div>
                                </label>
                                <label className="st-toggle-row">
                                    <div>
                                        <div className="st-toggle-label">Guest Checkout</div>
                                        <div className="st-toggle-desc">Allow customers to checkout without an account</div>
                                    </div>
                                    <div className={`st-toggle ${settings.allowGuestCheckout ? 'st-toggle-on' : ''}`} onClick={() => setSettings(p => ({ ...p, allowGuestCheckout: !p.allowGuestCheckout }))}>
                                        <div className="st-toggle-thumb" />
                                    </div>
                                </label>
                            </div>

                            <div className="st-form-actions">
                                <button type="submit" className="st-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Store Settings'}</button>
                            </div>
                        </form>
                    )}

                    {/* ── Shipping Settings ─────────────────────────────────── */}
                    {activeTab === 'shipping' && settings && (
                        <form className="st-form" onSubmit={handleSaveSettings}>
                            <div className="st-section-title">Shipping & Delivery</div>
                            <div className="st-grid-2">
                                <div className="st-field">
                                    <label>Standard Shipping Fee ({settings.storeCurrency})</label>
                                    <input type="number" min="0" step="0.01" value={settings.shippingFee ?? 350} onChange={e => setSettings(p => ({ ...p, shippingFee: parseFloat(e.target.value) }))} />
                                </div>
                                <div className="st-field">
                                    <label>Free Shipping Threshold ({settings.storeCurrency})</label>
                                    <input type="number" min="0" step="0.01" value={settings.freeShippingThreshold ?? 5000} onChange={e => setSettings(p => ({ ...p, freeShippingThreshold: parseFloat(e.target.value) }))} />
                                </div>
                                <div className="st-field">
                                    <label>Max Orders Per Day</label>
                                    <input type="number" min="1" value={settings.maxOrdersPerDay ?? 500} onChange={e => setSettings(p => ({ ...p, maxOrdersPerDay: parseInt(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="st-info-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Orders above <strong>{settings.storeCurrency} {settings.freeShippingThreshold?.toLocaleString()}</strong> will qualify for free shipping. Current shipping fee is <strong>{settings.storeCurrency} {settings.shippingFee}</strong>.
                            </div>
                            <div className="st-form-actions">
                                <button type="submit" className="st-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Shipping Settings'}</button>
                            </div>
                        </form>
                    )}

                    {/* ── Staff Management ──────────────────────────────────── */}
                    {activeTab === 'staff' && (
                        <div className="st-form">
                            <div className="st-staff-header">
                                <div>
                                    <div className="st-section-title">Team Members</div>
                                    <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{staffList.length} admin staff</p>
                                </div>
                                <button className="st-btn-primary" onClick={openNewStaff}>+ Add Staff</button>
                            </div>

                            <div className="st-staff-list">
                                {staffList.map(member => (
                                    <div key={member.id} className="st-staff-card">
                                        <div className="st-staff-avatar">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="st-staff-info">
                                            <div className="st-staff-name">{member.name}</div>
                                            <div className="st-staff-email">{member.email}</div>
                                            {member.lastLogin && (
                                                <div className="st-staff-last">Last login: {new Date(member.lastLogin).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                        <div className={`st-role-badge ${member.role === 'admin' ? 'st-badge-admin' : 'st-badge-manager'}`}>
                                            {member.role === 'admin' ? 'System Admin' : 'Store Manager'}
                                        </div>
                                        <div className="st-staff-actions">
                                            <button className="st-staff-btn-edit" onClick={() => openEditStaff(member)}>Edit</button>
                                            <button className="st-staff-btn-del" onClick={() => handleDeleteStaff(member.id)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
