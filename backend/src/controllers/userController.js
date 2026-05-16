import { User } from "../models/user/user.model.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ status: "SUCCESS", data: req.user });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, role } = req.body;

    // Prevent escalating to admin from API
    const allowedRoles = ["donor", "receiver", "volunteer"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Invalid role" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, ...(role && { role }) },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({ status: "SUCCESS", data: updated });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/users — Admin only
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      status: "SUCCESS",
      data: users,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/users/:id/verify — Admin only
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-__v");

    if (!user) return res.status(404).json({ status: "NOT_FOUND", message: "User not found" });

    return res.status(200).json({ status: "SUCCESS", data: user });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/users/:id/deactivate — Admin only
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-__v");

    if (!user) return res.status(404).json({ status: "NOT_FOUND", message: "User not found" });

    return res.status(200).json({ status: "SUCCESS", message: "User deactivated", data: user });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};