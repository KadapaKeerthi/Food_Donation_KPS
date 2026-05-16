import { Router } from "express";
import { loginWithGoogle, register, login, logout, getMe } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);   // ← NEW
authRouter.post("/login", login);         // ← NEW
authRouter.post("/google", loginWithGoogle);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, getMe);

export default authRouter;