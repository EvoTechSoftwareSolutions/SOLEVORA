import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PromoCodes.css';

const API = 'http://localhost:5000/api/promo';

const emptyForm = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
    isActive: true
};

const PromoCodes = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const notify = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(API);
            setPromos(data);
        } catch {
            notify('Failed to load promo codes', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPromos(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (promo) => {
        setEditingId(promo.id);
        setForm({
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            minOrderAmount: promo.minOrderAmount ?? '',
            maxUses: promo.maxUses ?? '',
            expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 10) : '',
            isActive: promo.isActive
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            discountValue: Number(form.discountValue),
            minOrderAmount: form.minOrderAmount !== '' ? Number(form.minOrderAmount) : 0,
            maxUses: form.maxUses !== '' ? Number(form.maxUses) : null,
            expiresAt: form.expiresAt || null
        };
        try {
            if (editingId) {
                await axios.put(`${API}/${editingId}`, payload);
                notify('Promo code updated successfully!');
            } else {
                await axios.post(API, payload);
                notify('Promo code created successfully!');
            }
            setShowForm(false);
            fetchPromos();
        } catch (err) {
            notify(err.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/${id}`);
            notify('Promo code deleted');
            setDeleteConfirm(null);
            fetchPromos();
        } catch {
            notify('Failed to delete promo code', 'error');
        }
    };

    const isExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();

    return (
        <div className="pc-container">
            {/* Header */}
            <div className="pc-header">
                <div>
                    <h1 className="pc-title">Promo Codes</h1>
                    <p className="pc-subtitle">Create and manage discount codes for customers</p>
                </div>
                <button className="pc-create-btn" onClick={openCreate}>
                    <span className="material-symbols-outlined">add</span>
                    New Promo Code
                </button>
            </div>

            {/* Toast notification */}
            {message.text && (
                <div className={`pc-toast pc-toast-${message.type}`}>{message.text}</div>
            )}

            {/* Stats Summary */}
            <div className="pc-stats">
                <div className="pc-stat-card">
                    <span className="pc-stat-icon material-symbols-outlined">confirmation_number</span>
                    <div>
                        <p className="pc-stat-val">{promos.length}</p>
                        <p className="pc-stat-lbl">Total Codes</p>
                    </div>
                </div>
                <div className="pc-stat-card">
                    <span className="pc-stat-icon pc-active material-symbols-outlined">check_circle</span>
                    <div>
                        <p className="pc-stat-val">{promos.filter(p => p.isActive && !isExpired(p.expiresAt)).length}</p>
                        <p className="pc-stat-lbl">Active</p>
                    </div>
                </div>
                <div className="pc-stat-card">
                    <span className="pc-stat-icon pc-used material-symbols-outlined">person</span>
                    <div>
                        <p className="pc-stat-val">{promos.reduce((s, p) => s + (p.usedCount || 0), 0)}</p>
                        <p className="pc-stat-lbl">Total Uses</p>
                    </div>
                </div>
                <div className="pc-stat-card">
                    <span className="pc-stat-icon pc-expired material-symbols-outlined">schedule</span>
                    <div>
                        <p className="pc-stat-val">{promos.filter(p => isExpired(p.expiresAt)).length}</p>
                        <p className="pc-stat-lbl">Expired</p>
                    </div>
                </div>
            </div>

            {/* Promo Table */}
            {loading ? (
                <div className="pc-loading">Loading promo codes...</div>
            ) : promos.length === 0 ? (
                <div className="pc-empty">
                    <span className="material-symbols-outlined pc-empty-icon">confirmation_number</span>
                    <p>No promo codes yet. Create your first one!</p>
                </div>
            ) : (
                <div className="pc-table-wrap">
                    <table className="pc-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Min Order</th>
                                <th>Usage</th>
                                <th>Expires</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map(promo => {
                                const expired = isExpired(promo.expiresAt);
                                const statusClass = !promo.isActive ? 'pc-badge-inactive'
                                    : expired ? 'pc-badge-expired'
                                    : 'pc-badge-active';
                                const statusLabel = !promo.isActive ? 'Inactive'
                                    : expired ? 'Expired'
                                    : 'Active';
                                return (
                                    <tr key={promo.id} className={expired || !promo.isActive ? 'pc-row-dim' : ''}>
                                        <td>
                                            <span className="pc-code-chip">{promo.code}</span>
                                        </td>
                                        <td>
                                            {promo.discountType === 'percentage'
                                                ? `${promo.discountValue}%`
                                                : `$${Number(promo.discountValue).toFixed(2)}`}
                                        </td>
                                        <td>${Number(promo.minOrderAmount).toFixed(2)}</td>
                                        <td>
                                            {promo.usedCount}
                                            {promo.maxUses ? ` / ${promo.maxUses}` : ' / ∞'}
                                        </td>
                                        <td>{promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : '—'}</td>
                                        <td><span className={`pc-badge ${statusClass}`}>{statusLabel}</span></td>
                                        <td>
                                            <div className="pc-actions">
                                                <button className="pc-edit-btn" onClick={() => openEdit(promo)} title="Edit">
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                                <button className="pc-del-btn" onClick={() => setDeleteConfirm(promo.id)} title="Delete">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {showForm && (
                <div className="pc-modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="pc-modal" onClick={e => e.stopPropagation()}>
                        <div className="pc-modal-header">
                            <h2>{editingId ? 'Edit Promo Code' : 'New Promo Code'}</h2>
                            <button className="pc-modal-close" onClick={() => setShowForm(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="pc-form" onSubmit={handleSubmit}>
                            <div className="pc-form-row">
                                <div className="pc-form-group">
                                    <label>Code *</label>
                                    <input name="code" value={form.code} onChange={handleChange}
                                        placeholder="e.g. SUMMER20" required className="pc-input" style={{ textTransform: 'uppercase' }} />
                                </div>
                                <div className="pc-form-group">
                                    <label>Discount Type *</label>
                                    <select name="discountType" value={form.discountType} onChange={handleChange} className="pc-input">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pc-form-row">
                                <div className="pc-form-group">
                                    <label>Discount Value * {form.discountType === 'percentage' ? '(%)' : '($)'}</label>
                                    <input name="discountValue" type="number" min="0" step="0.01"
                                        value={form.discountValue} onChange={handleChange} required
                                        placeholder={form.discountType === 'percentage' ? '10' : '5.00'} className="pc-input" />
                                </div>
                                <div className="pc-form-group">
                                    <label>Min Order Amount ($)</label>
                                    <input name="minOrderAmount" type="number" min="0" step="0.01"
                                        value={form.minOrderAmount} onChange={handleChange}
                                        placeholder="0.00" className="pc-input" />
                                </div>
                            </div>
                            <div className="pc-form-row">
                                <div className="pc-form-group">
                                    <label>Max Uses (blank = unlimited)</label>
                                    <input name="maxUses" type="number" min="1"
                                        value={form.maxUses} onChange={handleChange}
                                        placeholder="Unlimited" className="pc-input" />
                                </div>
                                <div className="pc-form-group">
                                    <label>Expires On (blank = never)</label>
                                    <input name="expiresAt" type="date"
                                        value={form.expiresAt} onChange={handleChange} className="pc-input" />
                                </div>
                            </div>
                            <div className="pc-form-check">
                                <label className="pc-check-label">
                                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                                    Active (visible to customers)
                                </label>
                            </div>
                            <div className="pc-form-actions">
                                <button type="button" className="pc-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="pc-submit-btn">
                                    {editingId ? 'Save Changes' : 'Create Code'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {deleteConfirm && (
                <div className="pc-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="pc-modal pc-confirm" onClick={e => e.stopPropagation()}>
                        <span className="material-symbols-outlined pc-confirm-icon">warning</span>
                        <h3>Delete Promo Code?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="pc-form-actions">
                            <button className="pc-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="pc-del-confirm-btn" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCodes;
