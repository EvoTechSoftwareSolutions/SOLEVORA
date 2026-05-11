import { body, validationResult } from "express-validator";

export const validateUser = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
    .matches(/^[A-Za-z0-9_]+$/).withMessage("Name must contain only letters"),

  // Email validation
  body("email")
    .notEmpty().withMessage("Email is required")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array(),
      });
    }

    next();
  },
];