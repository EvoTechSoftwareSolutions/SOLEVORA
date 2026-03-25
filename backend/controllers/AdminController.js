import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sequelize from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.count();
        const totalRevenue = await Order.sum('total_amount') || 0;
        const totalProducts = await Product.count();
        const lowStockItems = await Product.count({
            where: {
                stock_quantity: {
                    [sequelize.Sequelize.Op.lt]: 20
                }
            }
        });

        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        // Get monthly sales for the last 12 months
        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
            ],
            group: ['month'],
            order: [['month', 'ASC']],
            where: {
                createdAt: {
                    [sequelize.Sequelize.Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                }
            }
        });

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            lowStockItems,
            recentOrders,
            monthlySales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        const users = await User.findAll({
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
