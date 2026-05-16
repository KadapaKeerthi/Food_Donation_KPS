import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createRequest,
  getMyRequests,
  getRequestsForDonation,
  approveRequest,
  rejectRequest,
  withdrawRequest,
} from "../controllers/requestController.js";

const requestRouter = Router();

requestRouter.post("/", authenticate, authorize("receiver", "admin"), createRequest);
requestRouter.get("/my", authenticate, getMyRequests);
requestRouter.get("/donation/:donationId", authenticate, getRequestsForDonation);
requestRouter.patch("/:id/approve", authenticate, approveRequest);
requestRouter.patch("/:id/reject", authenticate, rejectRequest);
requestRouter.delete("/:id", authenticate, withdrawRequest);

export default requestRouter;