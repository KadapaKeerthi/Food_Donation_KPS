import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const oAuthClient = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET
);

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "7d" });

const setTokenCookie = (res, token) =>
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  });

// ── REGISTER ────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "BAD_REQUEST",
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "BAD_REQUEST",
        message: "Password must be at least 8 characters",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        status: "CONFLICT",
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.toLowerCase(),
      password,  // will be hashed by pre-save hook
    });

    return res.status(201).json({
      status: "SUCCESS",
      message: "Account created successfully! Please sign in.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("register error:", error.message);
    return res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

// ── LOGIN ────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "BAD_REQUEST",
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({
        status: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: "FORBIDDEN",
        message: "Your account has been deactivated",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Login successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("login error:", error.message);
    return res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

// ── GOOGLE LOGIN (existing, unchanged) ──────────
export const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ status: "BAD_REQUEST", message: "Google token not found" });

    let ticket;
    try {
      ticket = await oAuthClient.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return res.status(401).json({ status: "UNAUTHORIZED", message: "Invalid Google token" });
    }

    const { email, picture, given_name: firstName, family_name: lastName } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: `${firstName} ${lastName ?? ""}`.trim(),
        email,
        avatar: picture,
        role: "donor",
      });
    }

    const userToken = generateToken(user);
    setTokenCookie(res, userToken);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Login successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        token: userToken,
      },
    });
  } catch (error) {
    console.error("loginWithGoogle error:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
  }
};

// ── LOGOUT ──────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({ status: "SUCCESS", message: "Logged out successfully" });
};

// ── GET ME ──────────────────────────────────────
export const getMe = async (req, res) => {
  return res.status(200).json({ status: "SUCCESS", data: req.user });
};