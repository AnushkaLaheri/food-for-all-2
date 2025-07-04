import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donation.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix: CORS middleware with credentials support
const allowedOrigins = [
  "http://localhost:3000",
  "https://food-for-all-2.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: false, // Only use true if using cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))



// Parse incoming JSON
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/uploads", uploadRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
