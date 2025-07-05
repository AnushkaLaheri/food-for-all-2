import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    preparedDate: { type: Date },

    // ✅ Added expiry date fields
    expiryDays: { type: Number, default: 0 },
    expiryHours: { type: Number, default: 0 },
    expiryDate: { type: Date }, // <-- needed for sorting by expiry

    containsAllergens: { type: Boolean, default: false },

    pickupAddress: { type: String, required: true },
    pickupFrom: { type: String, required: true },
    pickupTo: { type: String, required: true },
    pickupDays: [{ type: String }],
    contactPreference: { type: String, required: true },
    notes: { type: String },

    // ✅ Photo URLs
    photos: [{ type: String }],

    // ✅ Dietary preferences
    dietaryPreferences: [{ type: String }],
  },
  { timestamps: true }
);

// Prevent overwrite on hot reload
export default mongoose.models.Donation || mongoose.model("Donation", donationSchema);
