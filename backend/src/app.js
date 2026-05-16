import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import connectDB from "./db/dbConnect.js";
import { config } from "./config.js";

// Routers
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import donationRouter from "./routes/donationRouter.js";
import requestRouter from "./routes/requestRouter.js";
import notificationRouter from "./routes/notificationRouter.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── DB ───────────────────────────────────────────────────────
connectDB();

// ─── API Routes ───────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/donations", donationRouter);
app.use("/api/requests", requestRouter);
app.use("/api/notifications", notificationRouter);

// ─── Health check ─────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.status(200).json({ status: "OK", message: "Food Donation API is running" })
);

// ─── Serve Frontend (Production) ─────────────────────────────
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("/*name", (req, res) =>
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
);

// ─── Start Server ─────────────────────────────────────────────
app.listen(config.PORT, () =>
  console.log(`🍱 Food Donation API running on PORT: ${config.PORT}`)
);