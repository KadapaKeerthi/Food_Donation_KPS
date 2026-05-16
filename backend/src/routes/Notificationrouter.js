import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.patch("/read-all", authenticate, markAllAsRead);
notificationRouter.patch("/:id/read", authenticate, markAsRead);
notificationRouter.delete("/:id", authenticate, deleteNotification);

export default notificationRouter;