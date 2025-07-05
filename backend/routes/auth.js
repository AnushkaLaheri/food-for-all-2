import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/authController.js";
const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);


// GET profile
router.get("/profile", authMiddleware, getUserProfile);

// PUT update profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
