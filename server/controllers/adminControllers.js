import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../schema/AdminSchema.js";
import dotenv from "dotenv";
import User from "../schema/userSchema.js";
import Contractor from "../schema/contractorSchema.js";
import { Bookingschema } from "../schema/BookingSchema.js";
import Log from "../schema/LogSchema.js";
import { createLog } from "../utils/createlog.js";   // ⭐ IMPORTANT

dotenv.config();



// ✅ Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    console.log("Admin authenticated");

    const token = jwt.sign({ adminId: admin._id, type: "admin" }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login success ✅",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Login Admin Error:", error);
  }
};

// ✅ Verify admin login (middleware use)
export const verifyAdmin = async (req, res) => {
  const token = req.cookies.admin_token;

  if (!token) return res.status(401).json({ valid: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.findById({ _id: decoded.adminId }).select("-password");

    if (!admin) return res.status(404).json({ valid: false, message: "Admin not found" });

    res.json({ valid: true, admin });
  } catch (error) {
    res.status(403).json({ valid: false, message: "Invalid token" });
  }
};

// ✅ Logout Admin
export const logoutAdmin = async (req, res) => {
  res.clearCookie("admin_token");
  return res.status(200).json({ message: "Admin logged out ✅" });
};




// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}) // You can filter by role if you have multiple types
      .select("name email phone address pincode createdAt isBlocked"); // Hide passwords

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Block / Unblock user
export const blockOrUnblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log("User to block/unblock:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked; // Toggle block state
    await user.save();
      await createLog({
      action: user.isBlocked ? "user_blocked" : "user_unblocked",
      message: `Admin ${user.isBlocked ? "blocked" : "unblocked"} user: ${user.name}`,
      user: user._id
    });


    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user,
    });
  } catch (error) {
    console.error("Error blocking user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find({})
      .select("name email phone profession experienceLevel isBlocked createdAt");

    res.status(200).json({
      success: true,
      total: contractors.length,
      contractors,
    });
  } catch (error) {
    console.error("Error fetching contractors:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Block / Unblock contractor
export const blockOrUnblockContractor = async (req, res) => {
  try {
    const { id } = req.params;
    const contractor = await Contractor.findById(id);

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    contractor.isBlocked = !contractor.isBlocked;
    await contractor.save();
       await createLog({
      action: contractor.isBlocked ? "contractor_blocked" : "contractor_unblocked",
      message: `Admin ${contractor.isBlocked ? "blocked" : "unblocked"} contractor: ${contractor.name}`,
      contractor: contractor._id
    });

    res.status(200).json({
      success: true,
      message: contractor.isBlocked
        ? "Contractor blocked successfully"
        : "Contractor unblocked successfully",
      contractor,
    });
  } catch (error) {
    console.error("Error blocking contractor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashboardCounts = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const contractors = await Contractor.countDocuments();
    const projects = await Bookingschema.countDocuments();
    const suppliers = 0;  // You don't have supplier schema yet

    res.status(200).json({
      success: true,
      counts: {
        users,
        contractors,
        suppliers,
        projects
      },
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
