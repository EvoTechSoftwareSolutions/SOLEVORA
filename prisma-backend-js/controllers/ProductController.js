import prisma from '../lib/prisma.js';

export const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;

        const whereClause = category && category !== 'All'
            ? { category: { name: category } }
            : {};

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: true,
                batches: true
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
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
        const {
            name, description, price, stock_quantity,
            image_url, image_url_2, image_url_3, image_url_4,
            categoryId, gender, sizes, size_range
        } = req.body;

        const product = await prisma.$transaction(async (tx) => {
            const created = await tx.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    stock_quantity: parseInt(stock_quantity) || 0,
                    image_url,
                    image_url_2,
                    image_url_3,
                    image_url_4,
                    categoryId: categoryId ? BigInt(categoryId) : null,
                    gender: gender || 'All',
                    sizes,
                    size_range
                }
            });

            // Create initial batch
            await tx.productBatch.create({
                data: {
                    productId: created.id,
                    quantity: parseInt(stock_quantity) || 0,
                    original_quantity: parseInt(stock_quantity) || 0,
                    selling_price: parseFloat(price),
                    batch_date: new Date()
                }
            });

            return created;
        });

        const fullProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: { category: true, batches: true }
        });

        res.status(201).json(fullProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const id = BigInt(req.params.id);

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (req.body.isNewBatch) {
            const addedQuantity = parseInt(req.body.added_quantity);
            const newPrice = parseFloat(req.body.price);

            await prisma.$transaction(async (tx) => {
                await tx.productBatch.create({
                    data: {
                        productId: id,
                        quantity: addedQuantity,
                        original_quantity: addedQuantity,
                        selling_price: newPrice,
                        batch_date: new Date()
                    }
                });

                const newTotalStock = parseInt(product.stock_quantity) + addedQuantity;

                const oldestBatch = await tx.productBatch.findFirst({
                    where: { productId: id, quantity: { gt: 0 } },
                    orderBy: { createdAt: 'asc' }
                });

                await tx.product.update({
                    where: { id },
                    data: {
                        stock_quantity: newTotalStock,
                        price: oldestBatch ? Number(oldestBatch.selling_price) : newPrice
                    }
                });
            });
        } else {
            const {
                name, description, price, stock_quantity,
                image_url, image_url_2, image_url_3, image_url_4,
                categoryId, gender, sizes, size_range
            } = req.body;

            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = parseFloat(price);
            if (stock_quantity !== undefined) updateData.stock_quantity = parseInt(stock_quantity);
            if (image_url !== undefined) updateData.image_url = image_url;
            if (image_url_2 !== undefined) updateData.image_url_2 = image_url_2;
            if (image_url_3 !== undefined) updateData.image_url_3 = image_url_3;
            if (image_url_4 !== undefined) updateData.image_url_4 = image_url_4;
            if (categoryId !== undefined) updateData.categoryId = categoryId ? BigInt(categoryId) : null;
            if (gender !== undefined) updateData.gender = gender;
            if (sizes !== undefined) updateData.sizes = sizes;
            if (size_range !== undefined) updateData.size_range = size_range;

            await prisma.product.update({ where: { id }, data: updateData });
        }

        const updatedProduct = await prisma.product.findUnique({
            where: { id },
            include: { category: true, batches: true }
        });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBatches = async (req, res) => {
    try {
        const batches = await prisma.productBatch.findMany({
            include: {
                product: { select: { name: true, image_url: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = BigInt(req.params.id);

        await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { productId } }),
            prisma.wishlist.deleteMany({ where: { productId } }),
            prisma.review.deleteMany({ where: { productId } }),
            prisma.productBatch.deleteMany({ where: { productId } }),
        ]);

        const deleted = await prisma.product.delete({ where: { id: productId } });

        if (deleted) {
            return res.status(204).send();
        }
        res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deductStockFIFO = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;

        await prisma.$transaction(async (tx) => {
            let remainingQty = quantity;

            // Fetch all batches for the product and size, ordered by creation date (FIFO)
            const batches = await tx.productBatch.findMany({
                where: { productId: BigInt(productId), size, quantity: { gt: 0 } },
                orderBy: { createdAt: 'asc' }
            });

            for (const batch of batches) {
                if (remainingQty <= 0) break;

                const deduct = Math.min(batch.quantity, remainingQty);

                // Deduct from the current batch
                await tx.productBatch.update({
                    where: { id: batch.id },
                    data: { quantity: batch.quantity - deduct }
                });

                remainingQty -= deduct;
            }

            if (remainingQty > 0) {
                throw new Error('Insufficient stock to fulfill the order');
            }

            // Update total stock quantity in the product table
            const totalStock = await tx.productBatch.aggregate({
                where: { productId: BigInt(productId) },
                _sum: { quantity: true }
            });

            await tx.product.update({
                where: { id: BigInt(productId) },
                data: { stock_quantity: totalStock._sum.quantity || 0 }
            });
        });

        res.status(200).json({ message: 'Stock deducted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
