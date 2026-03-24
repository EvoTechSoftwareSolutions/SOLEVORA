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
        cityStateZip: '',
        country: 'USA',
        phone: '',
        isDefault: false
    });

    const getUserId = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr).id;
        return null;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserId();
        if (!userId) {
            alert("Please login first");
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/addresses', {
                ...formData,
                userId
            });
            navigate('/profile/addresses');
        } catch (error) {
            console.error("Failed to add address", error);
            alert("Failed to save address. Please try again.");
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
