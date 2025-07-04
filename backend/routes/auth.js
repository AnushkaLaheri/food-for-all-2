import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/profile (Protected route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await req.user; // Already decoded in middleware
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
