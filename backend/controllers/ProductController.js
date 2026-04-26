import Product from '../models/Product.js';
import Category from '../models/Category.js';
import OrderItem from '../models/OrderItem.js';
import Wishlist from '../models/Wishlist.js';
import ProductBatch from '../models/ProductBatch.js';
import sequelize from '../config/db.js';

export const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let whereClause = {};
        
        if (category && category !== 'All') {
            whereClause = {
                '$category.name$': category
            };
        }

        const products = await Product.findAll({
            where: whereClause,
            include: [
                { model: Category, as: 'category' },
                { model: ProductBatch, as: 'batches' }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category' }]
        });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.create(req.body, { transaction: t });
        
        // Create initial batch
        await ProductBatch.create({
            productId: product.id,
            quantity: req.body.stock_quantity || 0,
            original_quantity: req.body.stock_quantity || 0,
            selling_price: req.body.price,
            batch_date: new Date()
        }, { transaction: t });

        await t.commit();

        const fullProduct = await Product.findByPk(product.id, {
            include: [
                { model: Category, as: 'category' },
                { model: ProductBatch, as: 'batches' }
            ]
        });
        res.status(201).json(fullProduct);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if we are adding a new batch
        if (req.body.isNewBatch) {
            await ProductBatch.create({
                productId: product.id,
                quantity: req.body.added_quantity,
                original_quantity: req.body.added_quantity,
                selling_price: req.body.price,
                batch_date: new Date()
            }, { transaction: t });

            // Update total stock on main product
            const newTotalStock = parseInt(product.stock_quantity) + parseInt(req.body.added_quantity);
            
            // Find oldest active batch to determine display price (FIFO)
            const oldestBatch = await ProductBatch.findOne({
                where: { productId: product.id, quantity: { [sequelize.Sequelize.Op.gt]: 0 } },
                order: [['createdAt', 'ASC']],
                transaction: t
            });

            await Product.update({
                stock_quantity: newTotalStock,
                price: oldestBatch ? oldestBatch.selling_price : req.body.price
            }, { 
                where: { id: req.params.id },
                transaction: t 
            });
        } else {
            // Normal update
            await Product.update(req.body, {
                where: { id: req.params.id },
                transaction: t
            });

            // If price or stock was manually edited, update the first batch for consistency? 
            // Or just leave it. Usually, batches should be the source of truth.
        }

        await t.commit();
        
        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },
                { model: ProductBatch, as: 'batches' }
            ]
        });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

// Get all batches for inventory report
export const getAllBatches = async (req, res) => {
    try {
        const batches = await ProductBatch.findAll({
            include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Remove dependencies to prevent foreign key constraint errors
        await OrderItem.destroy({ where: { productId } });
        await Wishlist.destroy({ where: { productId } });

        const deleted = await Product.destroy({
            where: { id: productId }
        });
        
        if (deleted) {
            return res.status(204).send();
        }
        res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
