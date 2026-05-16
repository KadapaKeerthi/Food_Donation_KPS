import { Schema, model } from "mongoose";

const requestSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donation: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending",
    },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

requestSchema.index({ receiver: 1, donation: 1 }, { unique: true });
requestSchema.index({ status: 1 });

export const Request = model("Request", requestSchema);