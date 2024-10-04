const express = require("express");

const { newOrder } = require("../controllers/orderController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");

const router = express.Router();


router.post("/order/new", verifyToken, newOrder);



module.exports = router;