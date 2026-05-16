// import jwt from "jsonwebtoken";
// import { config } from "../config.js";
// import { User } from "../models/user/user.model.js";

// export const authenticate = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.jwt ||
//       req.headers.authorization?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ status: "UNAUTHORIZED", message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, config.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-__v");

//     if (!user || !user.isActive) {
//       return res.status(401).json({ status: "UNAUTHORIZED", message: "User not found or inactive" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ status: "UNAUTHORIZED", message: "Invalid or expired token" });
//   }
// };

// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: "FORBIDDEN",
//         message: `Access denied. Required role(s): ${roles.join(", ")}`,
//       });
//     }
//     next();
//   };
// };

// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).json({ message: "Admin access only" });
//   }
//   next();
// };
// module.exports = { verifyToken, isAdmin };

import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/user/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ status: "UNAUTHORIZED", message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-__v");

    if (!user || !user.isActive) {
      return res.status(401).json({ status: "UNAUTHORIZED", message: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "FORBIDDEN",
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }
    next();
  };
};