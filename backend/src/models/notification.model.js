import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["donation_claimed", "request_approved", "request_rejected", "pickup_reminder", "general"],
      default: "general",
    },
    relatedDonation: { type: Schema.Types.ObjectId, ref: "Donation", default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });

export const Notification = model("Notification", notificationSchema);