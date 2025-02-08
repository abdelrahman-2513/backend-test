import { body } from "express-validator";

export const validateCreateProduct = [
    body("name").notEmpty().withMessage("Product name is required."),
    body("category").optional().isString().withMessage("Category must be a string."),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
    body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer."),
];

export const validateUpdateProduct = [
    body("name").optional().notEmpty().withMessage("Product name cannot be empty."),
    body("category").optional().isString().withMessage("Category must be a string."),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
    body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer."),
];
