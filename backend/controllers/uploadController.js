import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle file uploads
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Create URLs for the uploaded files
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = req.files.map(
      (file) => `${baseUrl}/uploads/${file.filename}`
    );

    res.status(200).json({
      message: "Files uploaded successfully",
      count: req.files.length,
      urls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};