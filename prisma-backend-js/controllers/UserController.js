import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id, name: user.name, email: user.email,
            phone: user.phone || '', location: user.location || '',
            streetAddress: user.streetAddress || '', city: user.city || '',
            postalCode: user.postalCode || '', country: user.country || '',
            newsletter: user.newsletter, pushNotifications: user.pushNotifications,
            usageReports: user.usageReports
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {
            name, email, phone, location,
            streetAddress, city, postalCode, country,
            newsletter, pushNotifications, usageReports,
            currentPassword, newPassword
        } = req.body;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        const updateData = {
            name, email, phone, location,
            streetAddress, city, postalCode, country,
        };

        if (newsletter !== undefined) updateData.newsletter = newsletter;
        if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications;
        if (usageReports !== undefined) updateData.usageReports = usageReports;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to set a new one' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect current password' });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updated = await prisma.user.update({ where: { id }, data: updateData });

        // Sync with Address table
        if (streetAddress || city || postalCode || country) {
            let address = await prisma.address.findFirst({ where: { userId: id, isDefault: true } });
            if (!address) {
                address = await prisma.address.findFirst({ where: { userId: id } });
            }

            if (address) {
                await prisma.address.updateMany({ where: { userId: id }, data: { isDefault: false } });
                await prisma.address.update({
                    where: { id: address.id },
                    data: {
                        name: name || user.name,
                        street: streetAddress || address.street,
                        city: city || address.city,
                        postalCode: postalCode || address.postalCode,
                        country: country || address.country,
                        phone: phone || user.phone,
                        title: location || address.title,
                        isDefault: true
                    }
                });
            } else if (streetAddress && city) {
                await prisma.address.updateMany({ where: { userId: id }, data: { isDefault: false } });
                await prisma.address.create({
                    data: {
                        userId: id,
                        title: location || 'Home',
                        name: name || user.name,
                        street: streetAddress,
                        city,
                        postalCode: postalCode || '',
                        country: country || 'Unknown',
                        phone: phone || user.phone,
                        isDefault: true
                    }
                });
            }
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updated.id, name: updated.name, email: updated.email,
                phone: updated.phone || '', location: updated.location || '',
                streetAddress: updated.streetAddress || '', city: updated.city || '',
                postalCode: updated.postalCode || '', country: updated.country || '',
                newsletter: updated.newsletter, pushNotifications: updated.pushNotifications,
                usageReports: updated.usageReports
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Profile update failed' });
    }
};

// Update Password
export const updatePassword = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id }, data: { password: hashedPassword } });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Password update failed' });
    }
};

// Delete Account
export const deleteAccount = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Deletion failed' });
    }
};
