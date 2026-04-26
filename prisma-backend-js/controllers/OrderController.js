import prisma from '../lib/prisma.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
    try {
        const {
            total_amount, shipping_address, contact_number,
            email, userId, items, payment_method, promo_code
        } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : null;

        // Handle promo code usage increment
        if (promo_code) {
            const promo = await prisma.promoCode.findFirst({
                where: { code: promo_code.trim().toUpperCase() }
            });
            if (promo) {
                if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
                    return res.status(400).json({ message: 'This promo code has reached its usage limit' });
                }
                await prisma.promoCode.update({
                    where: { id: promo.id },
                    data: { usedCount: { increment: 1 } }
                });
            }
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    total_amount: parseFloat(total_amount),
                    status: 'pending',
                    shipping_address,
                    contact_number,
                    email: normalizedEmail,
                    userId: userId ? parseInt(userId) : null,
                    payment_method: payment_method || 'online',
                    payment_status: 'pending'
                }
            });

            if (items && items.length > 0) {
                await tx.orderItem.createMany({
                    data: items.map(item => ({
                        orderId: newOrder.id,
                        productId: BigInt(item.productId),
                        quantity: item.quantity,
                        price_at_purchase: parseFloat(item.price),
                        size: item.size || null
                    }))
                });

                // FIFO Stock Deduction
                for (const item of items) {
                    const productId = BigInt(item.productId);

                    const product = await tx.product.findUnique({ where: { id: productId } });
                    if (!product || product.stock_quantity < item.quantity) {
                        throw new Error(`Insufficient stock for ${product ? product.name : 'Unknown Product'}.`);
                    }

                    const batches = await tx.productBatch.findMany({
                        where: { productId, quantity: { gt: 0 } },
                        orderBy: { createdAt: 'asc' }
                    });

                    let remaining = item.quantity;
                    for (const batch of batches) {
                        if (remaining <= 0) break;
                        const take = Math.min(batch.quantity, remaining);
                        await tx.productBatch.update({
                            where: { id: batch.id },
                            data: { quantity: batch.quantity - take }
                        });
                        remaining -= take;
                    }

                    const oldestBatch = await tx.productBatch.findFirst({
                        where: { productId, quantity: { gt: 0 } },
                        orderBy: { createdAt: 'asc' }
                    });

                    await tx.product.update({
                        where: { id: productId },
                        data: {
                            stock_quantity: Math.max(0, product.stock_quantity - item.quantity),
                            price: oldestBatch ? Number(oldestBatch.selling_price) : product.price
                        }
                    });
                }
            }

            return newOrder;
        });

        // Send COD confirmation email
        if (payment_method === 'cod') {
            const fullOrder = await prisma.order.findUnique({
                where: { id: order.id },
                include: { items: { include: { product: true } } }
            });
            if (fullOrder && fullOrder.email) {
                await sendOrderConfirmationEmail(fullOrder, fullOrder.items);
            }
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } }
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
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
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

        const orders = await prisma.order.findMany({
            where: { email },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const { status, tracking_number, carrier, payment_status, estimated_delivery, actual_delivery } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
        if (carrier !== undefined) updateData.carrier = carrier;
        if (payment_status) updateData.payment_status = payment_status;
        if (estimated_delivery) updateData.estimated_delivery = new Date(estimated_delivery);
        if (actual_delivery) updateData.actual_delivery = new Date(actual_delivery);

        const adminId = req.headers['x-admin-id'];
        if (!adminId && ['shipped', 'delivered', 'processing'].includes(status)) {
            return res.status(403).json({ message: 'Forbidden: Admin access required for status update.' });
        }

        if (status === 'delivered' && !actual_delivery) {
            updateData.actual_delivery = new Date();
        }
        if (status === 'paid') {
            updateData.payment_status = 'paid';
        }

        await prisma.order.update({ where: { id }, data: updateData });

        const updatedOrder = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } }
        });

        if (status === 'paid' && updatedOrder && updatedOrder.email) {
            await sendOrderConfirmationEmail(updatedOrder, updatedOrder.items);
        }

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
