import { Schema, model } from "mongoose";

const donationSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["cooked", "raw", "packaged", "beverages", "other"],
      required: true,
    },
    quantity: {
      amount: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["kg", "g", "litres", "ml", "pieces", "servings", "packets"],
        required: true,
      },
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    pickupAddress: {
      street: { type: String, required: true },
      city:   { type: String, required: true },
      state:  { type: String, required: true },
      pincode:{ type: String, required: true },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "claimed", "picked_up", "delivered", "expired", "cancelled"],
      default: "available",
    },
    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: { type: Date, default: null },
    assignedVolunteer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveredAt: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-expire logic (index)
donationSchema.index({ expiresAt: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donor: 1 });
donationSchema.index({ "pickupAddress.city": 1 });

export const Donation = model("Donation", donationSchema);