import { Notification } from "../models/notification.model.js";

// GET /api/notifications — Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("relatedDonation", "title status");

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    const total = await Notification.countDocuments({ user: req.user._id });

    return res.status(200).json({
      status: "SUCCESS",
      data: notifications,
      unreadCount,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/notifications/:id/read — Mark one notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ status: "NOT_FOUND", message: "Notification not found" });

    return res.status(200).json({ status: "SUCCESS", data: notification });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// PATCH /api/notifications/read-all — Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json({ status: "SUCCESS", message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};

// DELETE /api/notifications/:id — Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    return res.status(200).json({ status: "SUCCESS", message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};