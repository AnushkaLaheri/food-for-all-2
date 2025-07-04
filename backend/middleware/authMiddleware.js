import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Access Denied. No token provided." });
  // Handle Bearer token
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Attach full user to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
