import { Donation } from "../models/donation.model.js";
import { Notification } from "../models/notification.model.js";

// POST /api/donations — Donor creates a donation
export const createDonation = async (req, res) => {
  try {
    const { title, description, category, quantity, expiresAt, pickupAddress, images, notes } = req.body;

    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Expiry date must be in the future" });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      title,
      description,
      category,
      quantity,
      expiresAt,
      pickupAddress,
      images: images ?? [],
      notes,
    });

    return res.status(201).json({ status: "SUCCESS", message: "Donation listed successfully", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/donations — Public, filterable
export const getDonations = async (req, res) => {
  try {
    const { status = "available", category, city, page = 1, limit = 12 } = req.query;

    const filter = { status };
    if (category) filter.category = category;
    if (city) filter["pickupAddress.city"] = { $regex: city, $options: "i" };

    // Auto-expire stale ones
    await Donation.updateMany(
      { status: "available", expiresAt: { $lt: new Date() } },
      { status: "expired" }
    );

    const donations = await Donation.find(filter)
      .populate("donor", "name avatar email phone")
      .populate("claimedBy", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    const total = await Donation.countDocuments(filter);

    return res.status(200).json({
      status: "SUCCESS",
      data: donations,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/donations/:id — Single donation detail
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name avatar email phone address")
      .populate("claimedBy", "name avatar email phone")
      .populate("assignedVolunteer", "name avatar email phone")
      .select("-__v");

    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });

    return res.status(200).json({ status: "SUCCESS", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/donations/my — Donor sees their own donations
export const getMyDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { donor: req.user._id };
    if (status) filter.status = status;

    const donations = await Donation.find(filter)
      .populate("claimedBy", "name avatar email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    const total = await Donation.countDocuments(filter);

    return res.status(200).json({
      status: "SUCCESS",
      data: donations,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PUT /api/donations/:id — Donor updates their donation
export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });

    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not your donation" });
    }

    if (!["available"].includes(donation.status)) {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Cannot edit a claimed or delivered donation" });
    }

    const allowed = ["title", "description", "category", "quantity", "expiresAt", "pickupAddress", "images", "notes"];
    allowed.forEach((field) => { if (req.body[field] !== undefined) donation[field] = req.body[field]; });

    await donation.save();
    return res.status(200).json({ status: "SUCCESS", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// DELETE /api/donations/:id — Donor cancels / Admin deletes
export const cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });

    const isOwner = donation.donor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not authorized" });
    }

    donation.status = "cancelled";
    await donation.save();

    return res.status(200).json({ status: "SUCCESS", message: "Donation cancelled" });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/donations/:id/claim — Receiver claims a donation
export const claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donor", "name email");
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });
    if (donation.status !== "available") {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Donation is no longer available" });
    }
    if (donation.expiresAt < new Date()) {
      donation.status = "expired";
      await donation.save();
      return res.status(400).json({ status: "BAD_REQUEST", message: "Donation has expired" });
    }

    donation.status = "claimed";
    donation.claimedBy = req.user._id;
    donation.claimedAt = new Date();
    await donation.save();

    // Notify donor
    await Notification.create({
      user: donation.donor._id,
      title: "Your donation was claimed!",
      message: `${req.user.name} has claimed your donation "${donation.title}".`,
      type: "donation_claimed",
      relatedDonation: donation._id,
    });

    return res.status(200).json({ status: "SUCCESS", message: "Donation claimed successfully", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/donations/:id/assign-volunteer — Admin assigns a volunteer
export const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });

    donation.assignedVolunteer = volunteerId;
    await donation.save();

    return res.status(200).json({ status: "SUCCESS", message: "Volunteer assigned", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/donations/:id/mark-delivered — Volunteer marks as delivered
export const markDelivered = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("claimedBy", "name email");
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });
    if (donation.status !== "picked_up" && donation.status !== "claimed") {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Donation must be claimed or picked up first" });
    }

    donation.status = "delivered";
    donation.deliveredAt = new Date();
    await donation.save();

    if (donation.claimedBy) {
      await Notification.create({
        user: donation.claimedBy._id,
        title: "Your food is on the way!",
        message: `Donation "${donation.title}" has been marked as delivered.`,
        type: "general",
        relatedDonation: donation._id,
      });
    }

    return res.status(200).json({ status: "SUCCESS", message: "Marked as delivered", data: donation });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/donations/stats — Admin dashboard stats
export const getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const categoryStats = await Donation.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const totalDelivered = await Donation.countDocuments({ status: "delivered" });
    const totalAvailable = await Donation.countDocuments({ status: "available" });

    return res.status(200).json({
      status: "SUCCESS",
      data: { byStatus: stats, byCategory: categoryStats, totalDelivered, totalAvailable },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};