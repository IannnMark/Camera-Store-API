const express = require("express");

const { createProduct } = require("../controllers/productController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");
const router = express.Router();

router.post("/admin/product/new", verifyToken, authorizeRoles('admin'), createProduct);

module.exports = router;