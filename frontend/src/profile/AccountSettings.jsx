import React, { useState } from 'react';
import './AccountSettings.css';

const AccountSettings = () => {
    const [profileData, setProfileData] = useState({
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '••••••••',
        newPassword: '',
        confirmPassword: '',
    });

    const [twoFactor, setTwoFactor] = useState(false);

    const [preferences, setPreferences] = useState({
        newsletter: true,
        pushNotifications: true,
        usageReports: false,
    });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    return (
        <div className="as-container">
            {/* Page Header */}
            <div className="as-header">
                <h2>Account Management</h2>
                <p>Review your information and update your security preferences.</p>
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
                        <label htmlFor="as-location">Location</label>
                        <input
                            type="text"
                            id="as-location"
                            name="location"
                            value={profileData.location}
                            onChange={handleProfileChange}
                        />
                    </div>
                </div>
                <div className="as-card-actions">
                    <button className="as-btn-primary">Save Changes</button>
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
                    <button className="as-btn-primary">Update Password</button>
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
                    <button className="as-btn-primary">Save Preferences</button>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="as-delete-card">
                <div className="as-delete-info">
                    <h4>Delete Account</h4>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="as-btn-delete">Delete Account</button>
            </div>
        </div>
    );
};

export default AccountSettings;
