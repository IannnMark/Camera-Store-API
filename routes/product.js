const express = require("express");

const { createProduct, deleteProduct, updateProduct, getAdminProducts, getProduct } = require("../controllers/productController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");
const router = express.Router();

router.post("/admin/product/new", verifyToken, authorizeRoles('admin'), createProduct);
router.delete("/admin/product/delete/:id", verifyToken, authorizeRoles("admin"), deleteProduct);
router.put("/admin/product/update/:id", verifyToken, authorizeRoles("admin"), updateProduct);
router.get("/admin/products", verifyToken, authorizeRoles("admin"), getAdminProducts);
router.get("/get/:id", getProduct);

module.exports = router;