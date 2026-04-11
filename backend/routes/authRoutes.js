import express from 'express';
import User from '../models/User.js';
import Address from '../models/Address.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Prefer env vars; fall back to existing credentials for local dev.
        user: process.env.GMAIL_USER || 'prasadkumarasinghe725@gmail.com',
        pass: process.env.GMAIL_PASS || 'cagjsncvfzgyejcm',
    },
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // The User model beforeSave hook will handle password hashing
        await User.create({ name, email, password });
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Social Register Route
router.post('/social-register', async (req, res) => {
    try {
        const { name, email } = req.body;
        const defaultPassword = "social_login";
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.json({ message: "User already exists. Social login successful" });
        }

        await User.create({ name, email, password: defaultPassword });
        res.json({ message: "Social login successful" });
    } catch (error) {
        console.error("Social registration error:", error);
        res.status(500).json({ message: "Social registration failed" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                location: user.location || '',
                streetAddress: user.streetAddress || '',
                city: user.city || '',
                postalCode: user.postalCode || '',
                country: user.country || '',
                newsletter: user.newsletter,
                pushNotifications: user.pushNotifications,
                usageReports: user.usageReports
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate reset token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store reset token
        user.resetToken = tokenHash;
        user.resetTokenExpires = expiresAt;
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'prasadkumarasinghe725@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `
                <h2>Password Reset</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#f97316;color:white;text-decoration:none;border-radius:8px;">
                    Reset Password
                </a>
                <p>This link expires in 15 minutes.</p>
            `,
        });

        res.json({
            message: "Reset link sent to your email",
            // Useful during development if email delivery is blocked
            debugUrl: resetLink,
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Email sending failed" });
    }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({ where: { resetToken: tokenHash } });
        if (!user || !user.resetTokenExpires || user.resetTokenExpires <= new Date()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        res.json({ message: "Token valid" });
    } catch (error) {
        console.error("Verify token error:", error);
        res.status(500).json({ message: "Token verification failed" });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters" });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ where: { resetToken: tokenHash } });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires <= new Date()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // User model hook will hash password on save
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Reset failed" });
    }
});

// Admin / Store Manager Login Route
// Only users with role 'admin' or 'store_manager' can access the dashboard
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!['admin', 'store_manager'].includes(user.role)) {
            return res.status(403).json({ message: "Access denied. You do not have permission to access the admin panel." });
        }

        // Track last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            message: "Admin login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                location: user.location || '',
                streetAddress: user.streetAddress || '',
                city: user.city || '',
                postalCode: user.postalCode || '',
                country: user.country || '',
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Admin login failed" });
    }
});

// Get User Profile
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            location: user.location || '',
            streetAddress: user.streetAddress || '',
            city: user.city || '',
            postalCode: user.postalCode || '',
            country: user.country || '',
            newsletter: user.newsletter,
            pushNotifications: user.pushNotifications,
            usageReports: user.usageReports
        });
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
});

// Update User Profile
router.put('/user/:id', async (req, res) => {
    try {
        const { 
            name, email, phone, location, 
            streetAddress, city, postalCode, country,
            newsletter, pushNotifications, usageReports, 
            currentPassword, newPassword 
        } = req.body;
        
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already taken" });
            }
        }

        // Handle optional password update
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new one" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect current password" });
            }
            user.password = newPassword;
        }

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.location = location;
        user.streetAddress = streetAddress;
        user.city = city;
        user.postalCode = postalCode;
        user.country = country;

        if (newsletter !== undefined) user.newsletter = newsletter;
        if (pushNotifications !== undefined) user.pushNotifications = pushNotifications;
        if (usageReports !== undefined) user.usageReports = usageReports;

        await user.save();

        // Sync with Address table (Shipping Information)
        if (streetAddress || city || postalCode || country) {
            const cityStateZip = [city, postalCode].filter(Boolean).join(', ');
            
            // Try to find a default address first, then any address, or create new
            let address = await Address.findOne({ 
                where: { userId: user.id, isDefault: true } 
            });

            if (!address) {
                address = await Address.findOne({ where: { userId: user.id } });
            }

            if (address) {
                // If we are about to set this as default, unset others
                await Address.update({ isDefault: false }, { where: { userId: user.id } });

                // Update existing address
                await address.update({
                    name: name || user.name,
                    street: streetAddress || address.street,
                    cityStateZip: cityStateZip || address.cityStateZip,
                    country: country || address.country,
                    phone: phone || user.phone,
                    title: location || address.title,
                    isDefault: true 
                });
            } else if (streetAddress && city) {
                // Unset others before creating a new default
                await Address.update({ isDefault: false }, { where: { userId: user.id } });

                // Create a new address only if we have at least street and city
                await Address.create({
                    userId: user.id,
                    title: location || 'Home',
                    name: name || user.name,
                    street: streetAddress,
                    cityStateZip: cityStateZip,
                    country: country || 'Unknown',
                    phone: phone || user.phone,
                    isDefault: true
                });
            }
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                location: user.location || '',
                streetAddress: user.streetAddress || '',
                city: user.city || '',
                postalCode: user.postalCode || '',
                country: user.country || '',
                newsletter: user.newsletter,
                pushNotifications: user.pushNotifications,
                usageReports: user.usageReports
            }
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Profile update failed" });
    }
});

// Update Password
router.put('/user/:id/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({ message: "Password update failed" });
    }
});

// Delete Account
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        await user.destroy();
        res.json({ message: "Account deleted" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
});

export default router;