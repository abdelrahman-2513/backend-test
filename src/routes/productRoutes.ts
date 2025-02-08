import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
} from "../controllers/productController";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";
import { validateCreateProduct, validateUpdateProduct } from "../dtos/product-dto";

const router = express.Router();

router.route("/").post( authenticateToken, isAdmin, validateCreateProduct, createProduct).get(getAllProducts)
router.route("/category/:category").get( getProductsByCategory);
router.route("/:id").get( getProductById).put( authenticateToken, isAdmin, validateUpdateProduct, updateProduct).delete( authenticateToken, isAdmin, deleteProduct);
export default router ;
