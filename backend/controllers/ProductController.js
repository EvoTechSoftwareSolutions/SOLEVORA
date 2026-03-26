import Product from '../models/Product.js';
import Category from '../models/Category.js';
import OrderItem from '../models/OrderItem.js';
import Wishlist from '../models/Wishlist.js';

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
            include: [{ model: Category, as: 'category' }]
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
    try {
        const product = await Product.create(req.body);
        const fullProduct = await Product.findByPk(product.id, {
            include: [{ model: Category, as: 'category' }]
        });
        res.status(201).json(fullProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Product.update(req.body, {
            where: { id: req.params.id }
        });
        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category' }]
        });
        return res.status(200).json(updatedProduct);
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
