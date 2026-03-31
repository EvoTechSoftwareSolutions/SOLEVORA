import express from 'express';
import Address from '../models/Address.js';

const router = express.Router();

// Get All Addresses for User
router.get('/:userId', async (req, res) => {
    try {
        const addresses = await Address.findAll({ where: { userId: req.params.userId } });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
});

// Get Address Details
router.get('/details/:id', async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });
        res.json(address);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch address details" });
    }
});

// Create Address
router.post('/', async (req, res) => {
    try {
        const { userId, title, name, street, cityStateZip, country, phone, icon, isDefault } = req.body;
        
        if (isDefault) {
            await Address.update({ isDefault: false }, { where: { userId } });
        }

        const address = await Address.create({ userId, title, name, street, cityStateZip, country, phone, icon, isDefault });
        res.json({ message: "Address added successfully", address });
    } catch (error) {
        res.status(500).json({ message: "Failed to add address" });
    }
});

// Update Address
router.put('/:id', async (req, res) => {
    try {
        const { title, name, street, cityStateZip, country, phone, icon, isDefault } = req.body;
        const address = await Address.findByPk(req.params.id);
        
        if (!address) return res.status(404).json({ message: "Address not found" });

        if (isDefault && !address.isDefault) {
             await Address.update({ isDefault: false }, { where: { userId: address.userId } });
        }

        Object.assign(address, { title, name, street, cityStateZip, country, phone, icon, isDefault });
        await address.save();
        res.json({ message: "Address updated successfully", address });
    } catch (error) {
        res.status(500).json({ message: "Failed to update address" });
    }
});

// Delete Address
router.delete('/:id', async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });
        await address.destroy();
        res.json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete address" });
    }
});

export default router;
