import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  foodName: String,
  category: String,
  description: String,
  quantity: Number,
  unit: String,
  preparedDate: Date,
  expiryDays: Number,
  expiryHours: Number,
  containsAllergens: Boolean,

  pickupAddress: String,
  pickupFrom: String,
  pickupTo: String,
  pickupDays: [String],
  contactPreference: String,
  notes: String,

  photos: [String], // placeholder for image URLs or filenames
}, { timestamps: true });

export default mongoose.model("Donation", donationSchema);
