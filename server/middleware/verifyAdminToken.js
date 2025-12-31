import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../schema/AdminSchema.js";

dotenv.config();

export const verifyAdminToken = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.admin_token;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No admin token found." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 3️⃣ Find admin in DB
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found or deleted." });
    }

    // 4️⃣ Attach admin to request object (for further use)
    req.admin = admin;

    // 5️⃣ Continue to next middleware/controller
    next();

  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(403).json({ message: "Invalid or expired admin token." });
  }
};
