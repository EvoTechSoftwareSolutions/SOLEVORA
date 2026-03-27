import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

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

        const user = await User.findOne({ where: { email, password } });
        if (!user) {
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

// Admin / Store Manager Login Route
// Only users with role 'admin' or 'store_manager' can access the dashboard
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email, password } });
        if (!user) {
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
        const { name, email, phone, location, newsletter, pushNotifications, usageReports } = req.body;
        
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

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.location = location;
        if (newsletter !== undefined) user.newsletter = newsletter;
        if (pushNotifications !== undefined) user.pushNotifications = pushNotifications;
        if (usageReports !== undefined) user.usageReports = usageReports;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                location: user.location || '',
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
        
        if (!user || user.password !== currentPassword) {
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
