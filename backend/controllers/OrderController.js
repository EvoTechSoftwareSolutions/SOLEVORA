import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, contact_number, email, items } = req.body;
        
        // Create the main order
        const order = await Order.create({
            total_amount,
            shipping_address,
            contact_number,
            email,
            status: 'pending'
        });

        // Create the order items
        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));
            await OrderItem.bulkCreate(orderItems);
        }

        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId: order.id 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ 
                model: OrderItem, 
                include: [Product] 
            }]
        });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
