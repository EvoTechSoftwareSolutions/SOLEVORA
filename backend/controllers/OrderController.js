import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, contact_number, email, userId, items } = req.body;
        const order = await Order.create({ total_amount, status: 'pending', shipping_address, contact_number, email, userId });
        
        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price_at_purchase: item.price,
                size: item.size
            }));
            await OrderItem.bulkCreate(orderItems);

            // Update stock quantities
            for (const item of items) {
                await Product.decrement('stock_quantity', {
                    by: item.quantity,
                    where: { id: item.productId }
                });
            }
        }
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
        });
        if (order) res.status(200).json(order);
        else res.status(404).json({ message: 'Order not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        
        const orders = await Order.findAll({
            where: { email },
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
