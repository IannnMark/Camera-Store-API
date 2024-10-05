const express = require("express");

const { newOrder, getSingleOrder, myOrders, allOrders } = require("../controllers/orderController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");

const router = express.Router();


router.post("/order/new", verifyToken, newOrder);
router.get("/order/:id", verifyToken, getSingleOrder);
router.get("/orders/me", verifyToken, myOrders);
router.get("/admin/orders", verifyToken, authorizeRoles("admin"), allOrders);

module.exports = router;