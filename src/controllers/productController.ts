import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Repositories } from ".."; // Adjust based on your project structure
import ProductModel from "../models/productModel"; // Mongoose Model
import { asyncHandler } from "../utils/asyncHandler";
import dotenv from "dotenv";
dotenv.config();
const isMongoDB = process.env.DB_TYPE === "mongodb";

/**
 * @route   POST /products
 * @desc    Add a new product (Admin only)
 * @access  Admin
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }

    const { name, category, price, quantity } = req.body;

    if (isMongoDB) {
        
        const newProduct = new ProductModel({ name, category, price, quantity });
        await newProduct.save();
        return res.status(201).json({ product: newProduct, message: "Product created successfully" });
    } else {
       
        const newProduct = Repositories.productRepo().create({ name, category, price, quantity });
        const savedProduct = await Repositories.productRepo().save(newProduct);
        return res.status(201).json({ product: savedProduct, message: "Product created successfully" });
    }
});

/**
 * @route   GET /products
 * @desc    Get all products (with pagination)
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let products, totalProducts;

    if (isMongoDB) {
        const query: any = { isDeleted: false };

        if (category) query.category = category;
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

        products = await ProductModel.find(query).sort({ price: 1 }).skip(skip).limit(Number(limit));
        totalProducts = await ProductModel.countDocuments(query);
    } else {
        let query = Repositories.productRepo().createQueryBuilder("product");

        if (category) query.andWhere("product.category = :category", { category });
        if (minPrice) query.andWhere("product.price >= :minPrice", { minPrice: Number(minPrice) });
        if (maxPrice) query.andWhere("product.price <= :maxPrice", { maxPrice: Number(maxPrice) });

        products = await query.orderBy("product.price", "ASC").skip(skip).take(Number(limit)).getMany();
        totalProducts = await query.getCount();
    }

    res.json({ totalProducts, currentPage: Number(page), productsPerPage: Number(limit), products });
});

/**
 * @route   GET /products/category/:category
 * @desc    Get products by category (with pagination)
 * @access  Public
 */

export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const { category, } = req.params
    const skip = (Number(page) - 1) * Number(limit);
    if (isMongoDB) {


        const query: any = { isDeleted: false };

        if (category) query.category = category;
        const products = await ProductModel.find(query).sort({ price: -1 }).skip(skip).limit(Number(limit));
        res.json({ products });
    } else {
        let query = Repositories.productRepo().createQueryBuilder("product");

        if (category) query.andWhere("product.category = :category", { category });
        const products = await query.orderBy("product.price", "DESC").skip(skip).take(Number(limit)).getMany();
        res.json({ products });
    }
});


/**
 * @route   GET /products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    let product;
    if (isMongoDB) {
        product = await ProductModel.findById(id);
    } else {
        product = await Repositories.productRepo().findOne({ where: { id: Number(id) } });
    }

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
});

/**
 * @route   PUT /products/:id
 * @desc    Update a product (Admin only)
 * @access  Admin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    let product;
    if (isMongoDB) {
        product = await ProductModel.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        Object.assign(product, req.body);
        await product.save();
    } else {
        product = await Repositories.productRepo().findOne({ where: { id: Number(id) } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        Object.assign(product, req.body);
        await Repositories.productRepo().save(product);
    }

    res.status(200).json({ product, message: "Product updated successfully" });
});

/**
 * @route   DELETE /products/:id
 * @desc    Delete a product (Admin only)
 * @access  Admin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    let product;
    if (isMongoDB) {
        product = await ProductModel.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.isDeleted = true;
        await product.save();
    } else {
        product = await Repositories.productRepo().findOne({ where: { id: Number(id) } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        await Repositories.productRepo().softDelete(id);
    }

    res.status(204).json({ message: "Product deleted successfully" });
});
