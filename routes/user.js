const express = require("express");
const { updateUser, deleteUser } = require("../controllers/userController");
const verifyToken = require("../utils/verifyUser");
const { route } = require("./auth");

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("delete/:id", verifyToken, deleteUser);

module.exports = router;