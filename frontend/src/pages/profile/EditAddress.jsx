import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './AddAddress.css';

const EditAddress = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        street: '',
        cityStateZip: '',
        country: '',
        phone: '',
        isDefault: false
    });

    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/addresses/details/${id}`);
                setFormData(res.data);
            } catch (error) {
                console.error("Failed to fetch address details", error);
                alert("Failed to load address data");
            } finally {
                setLoading(false);
            }
        };
        fetchAddressDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`http://localhost:5000/api/addresses/${id}`, formData);
            navigate('/profile/addresses');
        } catch (error) {
            console.error("Failed to update address", error);
            alert("Failed to update address. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="aa-container">
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading address details...</div>
            </div>
        );
    }

    return (
        <div className="aa-container">
            <div className="aa-header">
                <Link to="/profile/addresses" className="aa-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Addresses
                </Link>
                <h2>Edit Address</h2>
                <p>Modify the details of your saved location.</p>
            </div>

            <form className="aa-form" onSubmit={handleSubmit}>
                <div className="aa-form-grid">
                    <div className="aa-input-group full-width">
                        <label>Address Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="e.g. Home, Office, Aunt's House" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Recipient's name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            placeholder="+1 (555) 000-0000" 
                            value={formData.phone} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="aa-input-group full-width">
                        <label>Street Address</label>
                        <input 
                            type="text" 
                            name="street" 
                            placeholder="House number and street name" 
                            value={formData.street} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>City, State, Zip</label>
                        <input 
                            type="text" 
                            name="cityStateZip" 
                            placeholder="New York, NY 10001" 
                            value={formData.cityStateZip} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>Country</label>
                        <input 
                            type="text" 
                            name="country" 
                            placeholder="United States" 
                            value={formData.country} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-checkbox-group full-width">
                        <label className="aa-checkbox-label">
                            <input 
                                type="checkbox" 
                                name="isDefault" 
                                checked={formData.isDefault} 
                                onChange={handleChange} 
                            />
                            Set as default shipping address
                        </label>
                    </div>
                </div>

                <div className="aa-actions">
                    <button type="button" className="aa-cancel-btn" onClick={() => navigate('/profile/addresses')}>Cancel Changes</button>
                    <button type="submit" className="aa-submit-btn" disabled={saving}>
                        {saving ? 'Updating...' : 'Update Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAddress;
