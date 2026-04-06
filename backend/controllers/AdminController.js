import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import OrderItem from '../models/OrderItem.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.count();
        const totalRevenue = await Order.sum('total_amount') || 0;
        const totalProducts = await Product.count();
        const lowStockItems = await Product.count({
            where: { stock_quantity: { [Op.lt]: 20 } }
        });

        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
            ],
            group: ['month'],
            order: [['month', 'ASC']],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                }
            }
        });

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
        const users = await User.findAll({
            where: { role: 'customer' },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ 
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }],
            order: [['createdAt', 'DESC']] 
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.destroy({ where: { id } });
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// System Settings  (Admin Only)
// Stored as a simple JSON file for portability; swap for a DB table if needed.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, '../data/systemSettings.json');

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
// Admin / Staff User Management  (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllAdminUsers = async (req, res) => {
    try {
        const adminUsers = await User.findAll({
            where: { role: { [Op.in]: ['admin', 'store_manager'] } },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
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

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const user = await User.create({ name, email, password, role });
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
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!['admin', 'store_manager'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        user.name  = name  || user.name;
        user.email = email || user.email;
        user.role  = role  || user.role;
        if (password) user.password = password;

        await user.save();
        res.status(200).json({
            message: 'Staff member updated',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (parseInt(id) === req.adminUser.id) {
            return res.status(400).json({ message: 'You cannot delete your own account from here.' });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.status(200).json({ message: 'Staff member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
