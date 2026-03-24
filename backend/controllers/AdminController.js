import Order from '../models/Order.js';
import Product from '../models/Product.js';
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

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            lowStockItems,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
