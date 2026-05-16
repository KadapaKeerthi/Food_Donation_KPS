import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createDonation,
  getDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  cancelDonation,
  claimDonation,
  assignVolunteer,
  markDelivered,
  getDonationStats,
} from "../controllers/donationController.js";

const donationRouter = Router();

// Public
donationRouter.get("/", getDonations);
donationRouter.get("/stats", authenticate, authorize("admin"), getDonationStats);
donationRouter.get("/my", authenticate, getMyDonations);
donationRouter.get("/:id", getDonationById);

// Donor
donationRouter.post("/", authenticate, authorize("donor", "admin"), createDonation);
donationRouter.put("/:id", authenticate, updateDonation);
donationRouter.delete("/:id", authenticate, cancelDonation);

// Receiver
donationRouter.patch("/:id/claim", authenticate, authorize("receiver", "admin"), claimDonation);

// Admin/Volunteer
donationRouter.patch("/:id/assign-volunteer", authenticate, authorize("admin"), assignVolunteer);
donationRouter.patch("/:id/mark-delivered", authenticate, authorize("volunteer", "admin"), markDelivered);

export default donationRouter;