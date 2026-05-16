import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  verifyUser,
  deactivateUser,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/profile", authenticate, getProfile);
userRouter.put("/profile", authenticate, updateProfile);

// Admin-only
userRouter.get("/", authenticate, authorize("admin"), getAllUsers);
userRouter.patch("/:id/verify", authenticate, authorize("admin"), verifyUser);
userRouter.patch("/:id/deactivate", authenticate, authorize("admin"), deactivateUser);

export default userRouter;