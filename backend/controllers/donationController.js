import Donation from "../models/Donation.js";

// POST /api/donations - Create a new donation
export const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      category,
      description,
      quantity,
      unit,
      preparedDate,
      expiryDays = 0,
      expiryHours = 0,
      containsAllergens = false,
      pickupAddress,
      pickupFrom,
      pickupTo,
      pickupDays = [],
      contactPreference,
      notes,
      photos = [],
      dietaryPreferences = [],
    } = req.body;

    // ✅ Calculate expiryDate
    let expiryDate = null;
    if (preparedDate) {
      const baseDate = new Date(preparedDate);
      baseDate.setDate(baseDate.getDate() + Number(expiryDays || 0));
      baseDate.setHours(baseDate.getHours() + Number(expiryHours || 0));
      expiryDate = baseDate;
    }

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
      expiryDate, // ✅ Add expiryDate to the document
      containsAllergens,
      pickupAddress,
      pickupFrom,
      pickupTo,
      pickupDays,
      contactPreference,
      notes,
      photos,
      dietaryPreferences,
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation submitted successfully!" });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/donations/my - Donations created by the logged-in user
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Fetch User Donations Error:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

// GET /api/donations - Public endpoint with filters and sorting
export const getFilteredDonations = async (req, res) => {
  try {
    const { categories, preferences, sortBy } = req.query;
    console.log("Incoming filters:", req.query);

    const query = {};

    // ✅ Filter by category (multiple)
    if (categories) {
      query.category = { $in: categories.split(",") };
    }

    // ✅ Filter by dietary preferences
    if (preferences) {
      query.dietaryPreferences = { $all: preferences.split(",") };
    }

    // ✅ Sorting logic
    const sortOptions = {
      recent: { createdAt: -1 },
      expiry: { expiryDate: 1 }, // closest expiry first
    };
    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const donations = await Donation.find(query)
      .populate("user", "name address contactPreference")
      .sort(sort);

    res.json(donations);
  } catch (error) {
    console.error("Error fetching filtered donations:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};
