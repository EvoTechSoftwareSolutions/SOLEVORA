/**
 * Role-Based Access Control Middleware
 *
 * Usage:
 *   router.get('/route', requireRole(['admin']), handler);
 *   router.get('/route', requireRole(['admin', 'store_manager']), handler);
 */

import prisma from '../lib/prisma.js';

export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const adminId = req.headers['x-admin-id'];

            if (!adminId) {
                return res.status(401).json({ message: 'Unauthorized: No admin session provided.' });
            }

            const user = await prisma.user.findUnique({
                where: { id: parseInt(adminId) }
            });

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: Admin user not found.' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Your role: ${user.role}`
                });
            }

            req.adminUser = user;
            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ message: 'Internal server error in role check.' });
        }
    };
};

export const requireAdmin       = requireRole(['admin']);
export const requireStoreAccess = requireRole(['admin', 'store_manager']);
