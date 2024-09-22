const express = require("express");
const { signUp, signIn, signOut, google } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/google", google);

module.exports = router;