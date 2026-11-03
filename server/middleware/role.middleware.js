const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before role authorization",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource. Required role(s): ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

const adminOnly = authorizeRoles("admin");

module.exports = { authorizeRoles, adminOnly };
