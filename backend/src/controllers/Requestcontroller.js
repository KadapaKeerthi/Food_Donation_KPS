import { Request } from "../models/request.model.js";
import { Donation } from "../models/donation.model.js";
import { Notification } from "../models/notification.model.js";

// POST /api/requests — Receiver submits a request for a donation
export const createRequest = async (req, res) => {
  try {
    const { donationId, message } = req.body;

    const donation = await Donation.findById(donationId).populate("donor");
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });
    if (donation.status !== "available") {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Donation is not available for requests" });
    }
    if (donation.donor._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ status: "BAD_REQUEST", message: "You cannot request your own donation" });
    }

    const existing = await Request.findOne({ receiver: req.user._id, donation: donationId });
    if (existing) {
      return res.status(409).json({ status: "CONFLICT", message: "You have already requested this donation" });
    }

    const request = await Request.create({
      receiver: req.user._id,
      donation: donationId,
      message,
    });

    // Notify donor
    await Notification.create({
      user: donation.donor._id,
      title: "New request for your donation",
      message: `${req.user.name} has requested your donation "${donation.title}".`,
      type: "donation_claimed",
      relatedDonation: donationId,
    });

    return res.status(201).json({ status: "SUCCESS", message: "Request submitted", data: request });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ status: "CONFLICT", message: "You already requested this donation" });
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/requests/my — Receiver sees their own requests
export const getMyRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { receiver: req.user._id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate({ path: "donation", populate: { path: "donor", select: "name avatar email phone" } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Request.countDocuments(filter);
    return res.status(200).json({ status: "SUCCESS", data: requests, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// GET /api/requests/donation/:donationId — Donor sees who requested their donation
export const getRequestsForDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ status: "NOT_FOUND", message: "Donation not found" });

    const isOwner = donation.donor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not authorized to view these requests" });
    }

    const requests = await Request.find({ donation: req.params.donationId })
      .populate("receiver", "name avatar email phone address")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: "SUCCESS", data: requests });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/requests/:id/approve — Donor approves a request
export const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation").populate("receiver", "name email");
    if (!request) return res.status(404).json({ status: "NOT_FOUND", message: "Request not found" });

    const donation = request.donation;
    const isOwner = donation.donor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not authorized" });
    }

    if (donation.status !== "available") {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Donation is no longer available" });
    }

    // Approve this, reject others
    request.status = "approved";
    request.respondedAt = new Date();
    await request.save();

    // Claim the donation
    donation.status = "claimed";
    donation.claimedBy = request.receiver._id;
    donation.claimedAt = new Date();
    await donation.save();

    // Reject all other pending requests for same donation
    await Request.updateMany(
      { donation: donation._id, _id: { $ne: request._id }, status: "pending" },
      { status: "rejected", respondedAt: new Date() }
    );

    // Notify receiver
    await Notification.create({
      user: request.receiver._id,
      title: "Your request was approved!",
      message: `Your request for "${donation.title}" has been approved. Please coordinate pickup with the donor.`,
      type: "request_approved",
      relatedDonation: donation._id,
    });

    return res.status(200).json({ status: "SUCCESS", message: "Request approved and donation claimed", data: request });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/requests/:id/reject — Donor rejects a request
export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation").populate("receiver", "name email");
    if (!request) return res.status(404).json({ status: "NOT_FOUND", message: "Request not found" });

    const isOwner = request.donation.donor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not authorized" });
    }

    request.status = "rejected";
    request.respondedAt = new Date();
    await request.save();

    await Notification.create({
      user: request.receiver._id,
      title: "Your request was not approved",
      message: `Your request for "${request.donation.title}" was not approved this time.`,
      type: "request_rejected",
      relatedDonation: request.donation._id,
    });

    return res.status(200).json({ status: "SUCCESS", message: "Request rejected", data: request });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// DELETE /api/requests/:id — Receiver withdraws their request
export const withdrawRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ status: "NOT_FOUND", message: "Request not found" });
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: "FORBIDDEN", message: "Not your request" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Can only withdraw pending requests" });
    }

    request.status = "withdrawn";
    await request.save();

    return res.status(200).json({ status: "SUCCESS", message: "Request withdrawn" });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};