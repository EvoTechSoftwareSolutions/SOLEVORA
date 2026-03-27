/**
 * Role-Based Access Control Middleware
 * 
 * Usage:
 *   router.get('/route', requireRole(['admin']), handler);
 *   router.get('/route', requireRole(['admin', 'store_manager']), handler);
 */

/**
 * Middleware factory that checks if the authenticated admin has one of the required roles.
 * Admin identity is passed via the X-Admin-Id header (set after admin login).
 */
import User from '../models/User.js';

export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Retrieve admin id from request header (set by frontend after login)
            const adminId = req.headers['x-admin-id'];

            if (!adminId) {
                return res.status(401).json({ message: 'Unauthorized: No admin session provided.' });
            }

            const user = await User.findByPk(adminId);

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: Admin user not found.' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Your role: ${user.role}`
                });
            }

            // Attach the admin user to the request for downstream use
            req.adminUser = user;
            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ message: 'Internal server error in role check.' });
        }
    };
};

/** Shorthand guards */
export const requireAdmin        = requireRole(['admin']);
export const requireStoreAccess  = requireRole(['admin', 'store_manager']);
