import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddAddress.css';

const AddAddress = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka',
        phone: '',
        isDefault: false
    });

    const trimOrEmpty = (v) => (typeof v === "string" ? v.trim() : "");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            console.log("Token exists:", !!token);
            console.log("Token length:", token?.length);
            if (!token) {
                alert("Session expired. Please login again.");
                return;
            }

            const payload = {
                title: trimOrEmpty(formData.title),
                name: trimOrEmpty(formData.name),
                street: trimOrEmpty(formData.street),
                city: trimOrEmpty(formData.city),
                postalCode: trimOrEmpty(formData.postalCode),
                country: trimOrEmpty(formData.country),
                phone: trimOrEmpty(formData.phone),
                isDefault: Boolean(formData.isDefault),
            };

            console.log("Sending payload:", JSON.stringify(payload, null, 2));

            const required = ["title", "name", "street", "city", "postalCode", "country", "phone"];
            console.log("Checking required fields:");
            required.forEach(field => {
                console.log(`${field}: "${payload[field]}" (empty: ${!payload[field]})`);
            });
            const missing = required.filter((k) => !payload[k] || payload[k].trim() === "");
            if (missing.length) {
                alert(`Please fill: ${missing.join(", ")}`);
                return;
            }

            await axios.post('http://localhost:5001/api/addresses', payload, {
              headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/profile/addresses');
        } catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;
            console.error("Failed to add address", { status, data, error });
            console.log("Full error response:", JSON.stringify(error?.response, null, 2));
            
            if (data?.message) {
                alert(`Error: ${data.message}`);
            } else if (status === 400) {
                alert("Invalid data provided. Please check all fields and try again.");
            } else if (status === 401) {
                alert("Session expired. Please login again.");
            } else if (status === 403) {
                alert("Access denied. You don't have permission to perform this action.");
            } else {
                alert("Failed to save address. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="aa-container">
            <div className="aa-header">
                <Link to="/profile/addresses" className="aa-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Addresses
                </Link>
                <h2>Add New Address</h2>
                <p>Fill in the details below to save a new shipping location.</p>
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
                            required
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
                        <label>City</label>
                        <input 
                            type="text" 
                            name="city" 
                            placeholder="Colombo" 
                            value={formData.city} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>Postal Code</label>
                        <input 
                            type="text" 
                            name="postalCode" 
                            placeholder="00100" 
                            value={formData.postalCode} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="aa-input-group">
                        <label>Country</label>
                        <input 
                            type="text" 
                            name="country" 
                            placeholder="United States, United Kingdom, etc." 
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
                    <button type="button" className="aa-cancel-btn" onClick={() => navigate('/profile/addresses')}>Cancel</button>
                    <button type="submit" className="aa-submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAddress;
