const express = require("express");
const { registerUser, loginUser, getUserProfile, updateProfile } = require("../Controllers/AuthController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateProfile);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

module.exports = router;
