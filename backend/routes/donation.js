import express from "express";
import { createDonation, getMyDonations } from "../controllers/donationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Donation from "../models/Donation.js"

const router = express.Router();

// Create a new donation
router.post("/", authMiddleware, createDonation);

// Get donations created by the logged-in user
router.get("/my", authMiddleware, getMyDonations);


// GET /api/donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name address contactPreference")
      .sort({ createdAt: -1 });
      
    res.json(donations); // Make sure this is an array!
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});


export default router;
