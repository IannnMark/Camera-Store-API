const express = require("express");
const { updateUser, deleteUser, allUsers, eraseUser, softDeleteUser } = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/admin/users", verifyToken, authorizeRoles("admin"), allUsers);
router.delete("/admin/delete/:id", verifyToken, authorizeRoles("admin"), eraseUser);
router.delete("/admin/user/soft-delete/:id", verifyToken, authorizeRoles("admin"), softDeleteUser);

module.exports = router;