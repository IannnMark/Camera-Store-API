const express = require("express");

const { createProduct, deleteProduct, updateProduct, getAdminProducts, getProduct, getProducts, getProductsByBrands, getBrand, softDeleteProduct, restoreProduct, getAdminSoftDeleteProducts } = require("../controllers/productController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");
const router = express.Router();

router.post("/admin/product/new", verifyToken, authorizeRoles('admin'), createProduct);
router.delete("/admin/product/delete/:id", verifyToken, authorizeRoles("admin"), deleteProduct);
router.put("/admin/product/update/:id", verifyToken, authorizeRoles("admin"), updateProduct);
router.get("/admin/products", verifyToken, authorizeRoles("admin"), getAdminProducts);
router.get("/get/:id", getProduct);
router.get("/get", getProducts);
router.get("/brands", getProductsByBrands);
router.get("/brand", getBrand);
router.delete("/admin/product/soft-delete/:id", verifyToken, authorizeRoles("admin"), softDeleteProduct);
router.put("/admin/product/restore-product/:id", verifyToken, authorizeRoles("admin"), restoreProduct);
router.get("/admin/soft-delete-products", verifyToken, authorizeRoles("admin"), getAdminSoftDeleteProducts);

module.exports = router;