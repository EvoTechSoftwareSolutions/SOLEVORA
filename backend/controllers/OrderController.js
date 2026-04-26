import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';
import ProductBatch from '../models/ProductBatch.js';
import sequelize from '../config/db.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, contact_number, email, userId, items, payment_method, promo_code } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : null;

        // 1. Handle Promo Code usage increment if provided
        if (promo_code) {
            const promo = await PromoCode.findOne({ where: { code: promo_code.trim().toUpperCase() } });
            if (promo) {
                // Double check if it still has uses left (in case it reached limit between validate and order)
                if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
                    return res.status(400).json({ message: 'This promo code has reached its usage limit' });
                }
                await promo.increment('usedCount', { by: 1 });
            }
        }

        // Payment status for COD is always pending initially. For online, should probably be handled by payment controller.
        const initialPaymentStatus = payment_method === 'cod' ? 'pending' : 'pending';

        const t = await sequelize.transaction();
        try {
            const order = await Order.create({ 
                total_amount, 
                status: 'pending', 
                shipping_address, 
                contact_number, 
                email: normalizedEmail, 
                userId,
                payment_method: payment_method || 'online',
                payment_status: initialPaymentStatus
            }, { transaction: t });
            
            if (items && items.length > 0) {
                const orderItems = items.map(item => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                    size: item.size
                }));
                await OrderItem.bulkCreate(orderItems, { transaction: t });

                // FIFO Stock Deduction Logic
                for (const item of items) {
                    // Lock the product row to prevent concurrent deduction issues
                    const product = await Product.findByPk(item.productId, { 
                        transaction: t,
                        lock: t.LOCK.UPDATE 
                    });

                    if (!product || product.stock_quantity < item.quantity) {
                        throw new Error(`Insufficient stock for ${product ? product.name : 'Unknown Product'}. Available: ${product ? product.stock_quantity : 0}`);
                    }

                    const batches = await ProductBatch.findAll({
                        where: { productId: item.productId, quantity: { [sequelize.Sequelize.Op.gt]: 0 } },
                        order: [['createdAt', 'ASC']],
                        transaction: t,
                        lock: t.LOCK.UPDATE
                    });

                    let remainingToDeduct = item.quantity;
                    for (const batch of batches) {
                        if (remainingToDeduct <= 0) break;
                        const take = Math.min(batch.quantity, remainingToDeduct);
                        batch.quantity -= take;
                        remainingToDeduct -= take;
                        await batch.save({ transaction: t });
                    }

                    // Safety Check: If we didn't have enough in batches (e.g. legacy data), 
                    // we still deduct from the main product to keep sync, but we already 
                    // checked product.stock_quantity >= item.quantity above.
                    
                    const oldestBatch = await ProductBatch.findOne({
                        where: { productId: item.productId, quantity: { [sequelize.Sequelize.Op.gt]: 0 } },
                        order: [['createdAt', 'ASC']],
                        transaction: t
                    });

                    await Product.update({
                        stock_quantity: Math.max(0, product.stock_quantity - item.quantity),
                        price: oldestBatch ? oldestBatch.selling_price : product.price
                    }, {
                        where: { id: item.productId },
                        transaction: t
                    });
                }
            }
            
            await t.commit();

            // Send email if it's COD (Order is "placed" immediately)
            if (payment_method === 'cod') {
                const fullOrder = await Order.findByPk(order.id, {
                    include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
                });
                if (fullOrder && fullOrder.email) {
                    await sendOrderConfirmationEmail(fullOrder, fullOrder.items);
                }
            }

            res.status(201).json(order);
        } catch (error) {
            await t.rollback();
            throw error;
        }
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
