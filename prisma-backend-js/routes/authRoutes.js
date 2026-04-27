import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { sendEmail } from '../utils/emailService.js';
import { getUserProfile, updateUserProfile, updatePassword, deleteAccount } from '../controllers/UserController.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
        if (!/[a-zA-Z]/.test(name)) return res.status(400).json({ message: 'Name must contain at least one letter and cannot be just symbols' });

        if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long' });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({ data: { name, email, password: hashedPassword } });
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Social Register
router.post('/social-register', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
        if (!/[a-zA-Z]/.test(name)) return res.status(400).json({ message: 'Name must contain at least one letter and cannot be just symbols' });

        if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.json({ message: 'User already exists. Social login successful' });
        }

        const hashedPassword = await bcrypt.hash('social_login', 10);
        await prisma.user.create({ data: { name, email, password: hashedPassword } });
        res.json({ message: 'Social login successful' });
    } catch (error) {
        console.error('Social registration error:', error);
        res.status(500).json({ message: 'Social registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

        if (!password) return res.status(400).json({ message: 'Password is required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id, name: user.name, email: user.email, role: user.role,
                phone: user.phone || '', location: user.location || '',
                streetAddress: user.streetAddress || '', city: user.city || '',
                postalCode: user.postalCode || '', country: user.country || '',
                newsletter: user.newsletter, pushNotifications: user.pushNotifications,
                usageReports: user.usageReports
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: tokenHash, resetTokenExpires: expiresAt }
        });

        const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

        await sendEmail({
            to: email,
            subject: 'Password Reset Link',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #1a1a2e;">Password Reset</h2>
                    <p>Click below to reset your password for your SoleVora account:</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="display:inline-block;padding:14px 25px;background:#f97316;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
                            Reset Password
                        </a>
                    </div>
                    <p style="font-size: 13px; color: #666;">This link expires in 15 minutes.</p>
                </div>
            `,
        });

        res.json({ message: 'Reset link sent to your email', debugUrl: resetLink });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Email sending failed' });
    }
});

// Verify Reset Token
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({ where: { resetToken: tokenHash } });
        if (!user || !user.resetTokenExpires || user.resetTokenExpires <= new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        res.json({ message: 'Token valid', role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Token verification failed' });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await prisma.user.findFirst({ where: { resetToken: tokenHash } });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires <= new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExpires: null }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Reset failed' });
    }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

        if (!password) return res.status(400).json({ message: 'Password is required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!['admin', 'store_manager'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have permission to access the admin panel.' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        res.json({
            message: 'Admin login successful',
            user: {
                id: user.id, name: user.name, email: user.email, role: user.role,
                phone: user.phone || '', location: user.location || '',
                streetAddress: user.streetAddress || '', city: user.city || '',
                postalCode: user.postalCode || '', country: user.country || '',
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Admin login failed' });
    }
});

// Get User Profile
router.get('/user/:id', getUserProfile);

// Update User Profile
router.put('/user/:id', updateUserProfile);

// Update Password
router.put('/user/:id/password', updatePassword);

// Delete Account
router.delete('/user/:id', deleteAccount);

export default router;
