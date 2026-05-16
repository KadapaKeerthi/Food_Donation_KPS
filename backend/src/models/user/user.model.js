import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, default: "https://avatar.iran.liara.run/public" },
    role: {
      type: String,
      enum: ["donor", "receiver", "volunteer", "admin"],
      default: "donor",
    },
    phone: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city:   { type: String, default: "" },
      state:  { type: String, default: "" },
      pincode:{ type: String, default: "" },
    },
    isVerified: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);