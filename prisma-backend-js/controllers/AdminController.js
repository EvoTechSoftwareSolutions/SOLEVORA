import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, '../data/systemSettings.json');

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await prisma.order.count();

        const revenueResult = await prisma.order.aggregate({
            _sum: { total_amount: true }
        });
        const totalRevenue = Number(revenueResult._sum.total_amount || 0);

        const totalProducts = await prisma.product.count();

        const lowStockItems = await prisma.product.count({
            where: { stock_quantity: { lt: 20 } }
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Raw query for monthly sales grouping
        const monthlySales = await prisma.$queryRaw`
            SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, SUM(total_amount) AS total
            FROM orders
            WHERE createdAt >= ${oneYearAgo}
            GROUP BY month
            ORDER BY month ASC
        `;

        res.status(200).json({ totalOrders, totalRevenue, totalProducts, lowStockItems, recentOrders, monthlySales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Customer Management
// ─────────────────────────────────────────────────────────────────────────────
export const getAllCustomers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'customer' },
            select: {
                id: true, name: true, email: true, role: true,
                phone: true, location: true, city: true, country: true,
                newsletter: true, lastLogin: true, createdAt: true, updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        await prisma.product.delete({ where: { id } });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Get all order IDs for this user
        const userOrders = await prisma.order.findMany({
            where: { userId: id },
            select: { id: true }
        });
        const orderIds = userOrders.map(o => o.id);

        // Delete cascading records
        await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
            prisma.address.deleteMany({ where: { userId: id } }),
            prisma.review.deleteMany({ where: { userId: id } }),
            prisma.wishlist.deleteMany({ where: { userId: id } }),
        ]);

        await prisma.order.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });

        res.status(200).json({ message: 'User and all associated records removed.' });
    } catch (error) {
        console.error('Error during safe user deletion:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// System Settings
// ─────────────────────────────────────────────────────────────────────────────
const defaultSettings = {
    storeName: 'SoleVora',
    storeEmail: 'admin@solevora.com',
    storePhone: '',
    storeCurrency: 'LKR',
    maxOrdersPerDay: 500,
    lowStockThreshold: 20,
    maintenanceMode: false,
    allowGuestCheckout: true,
    taxRate: 0,
    shippingFee: 350,
    freeShippingThreshold: 5000,
    updatedAt: new Date().toISOString()
};

const readSettings = () => {
    try {
        if (!fs.existsSync(SETTINGS_PATH)) {
            fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
            fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2));
        }
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    } catch {
        return defaultSettings;
    }
};

export const getSystemSettings = async (req, res) => {
    try {
        const settings = readSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSystemSettings = async (req, res) => {
    try {
        const current = readSettings();
        const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
        res.status(200).json({ message: 'Settings updated successfully', settings: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin / Staff User Management
// ─────────────────────────────────────────────────────────────────────────────
export const getAllAdminUsers = async (req, res) => {
    try {
        const adminUsers = await prisma.user.findMany({
            where: { role: { in: ['admin', 'store_manager'] } },
            select: {
                id: true, name: true, email: true, role: true,
                lastLogin: true, createdAt: true, updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(adminUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdminUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['admin', 'store_manager'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Only admin or store_manager allowed.' });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role }
        });

        res.status(201).json({
            message: `${role === 'admin' ? 'Admin' : 'Store Manager'} created successfully`,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdminUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email, role, password } = req.body;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!['admin', 'store_manager'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const updateData = {
            name: name || user.name,
            email: email || user.email,
            role: role || user.role,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updated = await prisma.user.update({ where: { id }, data: updateData });

        res.status(200).json({
            message: 'Staff member updated',
            user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAdminUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (id === req.adminUser.id) {
            return res.status(400).json({ message: 'You cannot delete your own account from here.' });
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await prisma.user.delete({ where: { id } });
        res.status(200).json({ message: 'Staff member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
