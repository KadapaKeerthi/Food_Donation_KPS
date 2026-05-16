import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null },  // ← ADD THIS
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

// Auto-hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export const User = model("User", userSchema);
