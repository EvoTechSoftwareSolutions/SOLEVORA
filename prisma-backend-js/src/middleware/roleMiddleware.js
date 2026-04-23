export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({
          message: "Unauthorized - role missing",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied - insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Role validation error",
      });
    }
  };
};