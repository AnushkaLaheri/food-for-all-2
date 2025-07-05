import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address || !role || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({
      name,
      email,
      phone,
      address,
      role,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log("🔄 Updating profile...");
    console.log("🟡 req.user:", req.user);
    console.log("🟡 req.body:", req.body);

    const userId = req.user?.id; // Make sure authMiddleware sets req.user
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      bio: req.body.bio,
      image: req.body.image, // Make sure this exists in your User schema
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User updated:", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in updateUserProfile:", error);
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};
