// routes/profile-upload.js
import express from "express"
import multer from "multer"
import path from "path"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// Storage config for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-images/")
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|png)$/i)) {
      return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  },
})

// POST /api/upload/profile-image
router.post("/profile-image", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const imageUrl = `/uploads/profile-images/${req.file.filename}`
  return res.status(200).json({ imageUrl })
})

export default router
