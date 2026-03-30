import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountSettings.css';

const AccountSettings = () => {
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: '',
    });


    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState("");

    const [twoFactor, setTwoFactor] = useState(false);

    const [preferences, setPreferences] = useState({
        newsletter: true,
        pushNotifications: true,
        usageReports: false,
    });

    const getUserId = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            return JSON.parse(userStr).id;
        }
        return null;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = getUserId();
            if (!userId) return;

            try {
                const res = await axios.get(`http://localhost:5000/user/${userId}`);
                setProfileData({
                    fullName: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    location: res.data.location || '',
                    streetAddress: res.data.streetAddress || '',
                    city: res.data.city || '',
                    postalCode: res.data.postalCode || '',
                    country: res.data.country || '',
                });
                setPreferences({
                    newsletter: res.data.newsletter,
                    pushNotifications: res.data.pushNotifications,
                    usageReports: res.data.usageReports
                });

            } catch (err) {
                console.error("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const saveChanges = async (type) => {
        const userId = getUserId();
        if (!userId) {
            setMessage("You are not logged in!");
            return;
        }
        
        try {
            let res;
            if (type === 'profile' || type === 'preferences') {
                const payload = {
                    name: profileData.fullName,
                    email: profileData.email,
                    phone: profileData.phone,
                    location: profileData.location,
                    streetAddress: profileData.streetAddress,
                    city: profileData.city,
                    postalCode: profileData.postalCode,
                    country: profileData.country,
                    ...preferences
                };


                // Automatically include password change if new password is provided
                if (passwordData.newPassword) {
                    if (passwordData.newPassword !== passwordData.confirmPassword) {
                        setMessage("New passwords do not match");
                        return;
                    }
                    if (!passwordData.currentPassword) {
                        setMessage("Current password is required to set a new one");
                        return;
                    }
                    payload.currentPassword = passwordData.currentPassword;
                    payload.newPassword = passwordData.newPassword;
                }

                res = await axios.put(`http://localhost:5000/user/${userId}`, payload);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                // Clear password fields on success
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else if (type === 'password') {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setMessage("Passwords do not match");
                    return;
                }
                res = await axios.put(`http://localhost:5000/user/${userId}/password`, {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }

            setMessage(res.data.message);
            setTimeout(() => setMessage(""), 3000); 
        } catch (err) {
            setMessage(err.response?.data?.message || "Operation failed");
        }
    };


    const deleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This is permanent!")) return;
        const userId = getUserId();
        try {
            await axios.delete(`http://localhost:5000/user/${userId}`);
            localStorage.removeItem("user");
            window.location.href = "/";
        } catch (err) {
            setMessage("Failed to delete account");
        }
    };

    return (
        <div className="as-container">
            {/* Page Header */}
            <div className="as-header">
                <h2>Account Management</h2>
                <p>Review your information and update your security preferences.</p>
                {message && <div style={{marginTop: "1rem", color: "#f97316", fontWeight: "600"}}>{message}</div>}
            </div>

            {/* Profile Information Section */}
            <div className="as-card">
                <div className="as-card-title">
                    <span className="material-symbols-outlined as-card-icon as-profile-icon">person</span>
                    <h3>Profile Information</h3>
                </div>
                <div className="as-form-grid">
                    <div className="as-form-group">
                        <label htmlFor="as-fullName">Full Name</label>
                        <input
                            type="text"
                            id="as-fullName"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-email">Email Address</label>
                        <input
                            type="email"
                            id="as-email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-phone">Phone Number</label>
                        <input
                            type="tel"
                            id="as-phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-location">Location Label</label>
                        <input
                            type="text"
                            id="as-location"
                            name="location"
                            placeholder="Home, Office, etc."
                            value={profileData.location}
                            onChange={handleProfileChange}
                        />
                    </div>
                </div>

                <div className="as-card-divider"></div>

                <div className="as-card-heading">
                    <span className="material-symbols-outlined">local_shipping</span>
                    <h4>Default Shipping Address</h4>
                </div>

                <div className="as-form-grid">
                    <div className="as-form-group as-full-width">

                        <label htmlFor="as-streetAddress">Street Address</label>
                        <input
                            type="text"
                            id="as-streetAddress"
                            name="streetAddress"
                            placeholder="123 Luxury Lane"
                            value={profileData.streetAddress}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-city">City</label>
                        <input
                            type="text"
                            id="as-city"
                            name="city"
                            placeholder="New York"
                            value={profileData.city}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="as-postalCode"
                            name="postalCode"
                            placeholder="10001"
                            value={profileData.postalCode}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="as-form-group as-full-width">
                        <label htmlFor="as-country">Country</label>
                        <input
                            type="text"
                            id="as-country"
                            name="country"
                            placeholder="United States"
                            value={profileData.country}
                            onChange={handleProfileChange}
                        />
                    </div>
                </div>

                <div className="as-card-actions">
                    <button className="as-btn-primary" onClick={() => saveChanges('profile')}>Save Changes</button>
                </div>
            </div>

            {/* Security Section */}
            <div className="as-card">
                <div className="as-card-title">
                    <span className="material-symbols-outlined as-card-icon as-security-icon">shield_lock</span>
                    <h3>Security</h3>
                </div>
                <div className="as-form-grid as-single-col-first">
                    <div className="as-form-group as-full-width">
                        <label htmlFor="as-currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="as-currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-newPassword">New Password</label>
                        <input
                            type="password"
                            id="as-newPassword"
                            name="newPassword"
                            placeholder="Min. 8 characters"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="as-form-group">
                        <label htmlFor="as-confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="as-confirmPassword"
                            name="confirmPassword"
                            placeholder="Re-type new password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="as-two-factor-row">
                    <div className="as-two-factor-info">
                        <div className="as-two-factor-icon-wrap">
                            <span className="material-symbols-outlined as-two-factor-icon">verified_user</span>
                        </div>
                        <div>
                            <h4>Two-Factor Authentication</h4>
                            <p>Secure your account with an extra layer of protection</p>
                        </div>
                    </div>
                    <label className="as-toggle-switch">
                        <input
                            type="checkbox"
                            checked={twoFactor}
                            onChange={() => setTwoFactor(!twoFactor)}
                        />
                        <span className="as-toggle-slider"></span>
                    </label>
                </div>

                <div className="as-card-actions">
                    <button className="as-btn-primary" onClick={() => saveChanges('password')}>Update Password</button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="as-card">
                <div className="as-card-title">
                    <span className="material-symbols-outlined as-card-icon as-preferences-icon">settings</span>
                    <h3>Preferences</h3>
                </div>
                <div className="as-preferences-list">
                    {/* Newsletter */}
                    <div className="as-preference-item">
                        <div className="as-preference-info">
                            <div className="as-preference-icon-wrap">
                                <span className="material-symbols-outlined as-preference-icon">mail</span>
                            </div>
                            <div>
                                <h4>Newsletter</h4>
                                <p>Weekly solar insights and energy saving tips</p>
                            </div>
                        </div>
                        <label className="as-toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.newsletter}
                                onChange={() => setPreferences({ ...preferences, newsletter: !preferences.newsletter })}
                            />
                            <span className="as-toggle-slider"></span>
                        </label>
                    </div>

                    {/* Push Notifications */}
                    <div className="as-preference-item">
                        <div className="as-preference-info">
                            <div className="as-preference-icon-wrap">
                                <span className="material-symbols-outlined as-preference-icon">notifications</span>
                            </div>
                            <div>
                                <h4>Push Notifications</h4>
                                <p>Get alerts about your panel performance in real-time</p>
                            </div>
                        </div>
                        <label className="as-toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.pushNotifications}
                                onChange={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
                            />
                            <span className="as-toggle-slider"></span>
                        </label>
                    </div>

                    {/* Usage Reports */}
                    <div className="as-preference-item">
                        <div className="as-preference-info">
                            <div className="as-preference-icon-wrap">
                                <span className="material-symbols-outlined as-preference-icon">lab_profile</span>
                            </div>
                            <div>
                                <h4>Usage Reports</h4>
                                <p>Monthly breakdown of your energy consumption</p>
                            </div>
                        </div>
                        <label className="as-toggle-switch">
                            <input
                                type="checkbox"
                                checked={preferences.usageReports}
                                onChange={() => setPreferences({ ...preferences, usageReports: !preferences.usageReports })}
                            />
                            <span className="as-toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="as-card-actions">
                    <button className="as-btn-primary" onClick={() => saveChanges('preferences')}>Save Preferences</button>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="as-delete-card">
                <div className="as-delete-info">
                    <h4>Delete Account</h4>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="as-btn-delete" onClick={deleteAccount}>Delete Account</button>
            </div>
        </div>
    );
};

export default AccountSettings;
