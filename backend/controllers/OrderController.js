import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, contact_number, email, userId, items, payment_method } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : null;

        // Payment status for COD is always pending initially. For online, should probably be handled by payment controller.
        const initialPaymentStatus = payment_method === 'cod' ? 'pending' : 'pending';

        const order = await Order.create({ 
            total_amount, 
            status: 'pending', 
            shipping_address, 
            contact_number, 
            email: normalizedEmail, 
            userId,
            payment_method: payment_method || 'online',
            payment_status: initialPaymentStatus
        });
        
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
            
            // Send email if it's COD (Order is "placed" immediately)
            if (payment_method === 'cod') {
                const fullOrder = await Order.findByPk(order.id, {
                    include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
                });
                if (fullOrder && fullOrder.email) {
                    await sendOrderConfirmationEmail(fullOrder, fullOrder.items);
                }
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
export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getOrdersByEmail = async (req, res) => {
    try {
        let { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        
        email = email.trim().toLowerCase();

        const orders = await Order.findAll({
            where: Order.sequelize.where(
                Order.sequelize.fn('TRIM', Order.sequelize.col('email')),
                email
            ),
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tracking_number, carrier, payment_status, estimated_delivery, actual_delivery } = req.body;
        
        const updateData = {};
        if (status) updateData.status = status;
        if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
        if (carrier !== undefined) updateData.carrier = carrier;
        if (payment_status) updateData.payment_status = payment_status;
        if (estimated_delivery) updateData.estimated_delivery = estimated_delivery;
        if (actual_delivery) updateData.actual_delivery = actual_delivery;

        // Security Check: Only allow 'paid' or 'cancelled' updates without admin role
        const adminId = req.headers['x-admin-id'];
        if (!adminId && (status === 'shipped' || status === 'delivered' || status === 'processing')) {
            return res.status(403).json({ message: 'Forbidden: Admin access required for status update.' });
        }

        // Auto-update extra fields based on status
        if (status === 'delivered' && !actual_delivery) {
            updateData.actual_delivery = new Date();
        }
        if (status === 'paid') {
            updateData.payment_status = 'paid';
        }

        await Order.update(updateData, { where: { id } });
        
        const updatedOrder = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
        });

        // Trigger email if status just changed to paid (for online payment fallback)
        if (status === 'paid' && updatedOrder && updatedOrder.email) {
            await sendOrderConfirmationEmail(updatedOrder, updatedOrder.items);
        }

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
