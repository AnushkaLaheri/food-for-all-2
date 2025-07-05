import express from "express";
import {
  createDonation,
  getMyDonations,
  getFilteredDonations,
} from "../controllers/donationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Donation from "../models/Donation.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create a new donation
router.post("/", authMiddleware, createDonation);

// ✅ Get donations created by the logged-in user
router.get("/my", authMiddleware, getMyDonations);

// ✅ Filtered donations (used by frontend explore page)
router.get("/", getFilteredDonations);

// ✅ Get 3 most recent donations
router.get("/recent", async (req, res) => {
  try {
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("foodName description photos category donatedBy");
    res.status(200).json(recentDonations);
  } catch (error) {
    console.error("Error fetching recent donations:", error.message);
    res.status(500).json({ message: "Failed to fetch recent donations" });
  }
});

// ✅ Donation stats
router.get("/stats", async (req, res) => {
  try {
    console.log("Fetching stats...");

    const totalDonations = await Donation.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCommunities = 0; // Optional static or calculated value

    res.json({
      totalDonations: totalDonations || 0,
      totalUsers: totalUsers || 0,
      totalCommunities: totalCommunities || 0,
    });
  } catch (err) {
    console.error("Failed to fetch stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
