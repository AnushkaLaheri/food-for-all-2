import Donation from "../models/Donation.js";

// POST /api/donations
export const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      category,
      description,
      quantity,
      unit,
      preparedDate,
      expiryDays,
      expiryHours,
      containsAllergens,
      pickupAddress,
      pickupFrom,
      pickupTo,
      pickupDays,
      contactPreference,
      notes,
      photos,
    } = req.body;

    const newDonation = new Donation({
      user: req.user.id,
      foodName,
      category,
      description,
      quantity,
      unit,
      preparedDate,
      expiryDays,
      expiryHours,
      containsAllergens,
      pickupAddress,
      pickupFrom,
      pickupTo,
      pickupDays,
      contactPreference,
      notes,
      photos,
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation submitted successfully!" });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};