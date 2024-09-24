const express = require("express");
const { updateUser } = require("../controllers/userController");
const verifyToken = require("../utils/verifyUser");
const { route } = require("./auth");

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);

module.exports = router;