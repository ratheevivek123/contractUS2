import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Contractor from "../schema/contractorSchema.js";
import dotenv from "dotenv";
import { createLog } from "../utils/createlog.js";   // ⭐ IMPORTANT
dotenv.config();


// REGISTER CONTRACTOR
export const registerContractor = async (req, res) => {
  try {
    const { name, email, phone, profession, experienceLevel, address, pincode, password } = req.body;

    if (!name || !email || !phone || !profession || !experienceLevel || !address || !pincode || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(409).json({ message: "Contractor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const contractor = new Contractor({
      name,
      email,
      phone,
      profession,
      experienceLevel,
      address,
      pincode,
      password: hashedPassword,
    });

    await contractor.save();

    // ⭐ LOG: Contractor Registered
     await createLog({
      action: "contractor_registered",
      message: `New contractor registered: ${contractor.name}`,
      contractor: contractor._id
    });

    res.status(201).json({
      message: "Contractor registered successfully",
      contractor: {
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        phone: contractor.phone,
        profession: contractor.profession,
        experienceLevel: contractor.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Error registering contractor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// LOGIN CONTRACTOR
export const loginContractor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const contractor = await Contractor.findOne({ email });
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    const isMatch = await bcrypt.compare(password, contractor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (contractor.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    const token = jwt.sign(
      { contractorId: contractor._id, type: "contractor" },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.cookie("contractor_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ⭐ LOG: Contractor Login
    await createLog({
      type: "contractor_login",
      contractorId: contractor._id,
      message: `${contractor.name} logged in`,
    });

    res.status(200).json({
      message: "Login successful",
      contractor: {
        name: contractor.name,
        email: contractor.email,
        phone: contractor.phone,
        profession: contractor.profession,
        experienceLevel: contractor.experienceLevel,
        address: contractor.address,
        pincode: contractor.pincode,
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// VERIFY TOKEN
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.contractor_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const contractorId = decoded.contractorId;

    const contractor = await Contractor.findById(contractorId).select("-password");

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    if (contractor.isBlocked) {
      return res.status(403).json({ valid: false, message: "Your account is blocked" });
    }

    return res.status(200).json({ valid: true, contractor });

  } catch (error) {
    console.error("Error verifying contractor token:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// LOGOUT CONTRACTOR
export const logoutContractor = async (req, res) => {
  try {
    res.clearCookie("contractor_token");

    // ⭐ LOG: Logout
    await createLog({
      type: "contractor_logout",
      message: "Contractor logged out",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// GET ALL CONTRACTORS
export const getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find().select("-password");

    res.status(200).json(contractors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};



// UPDATE PROFILE (GOOGLE + NORMAL BOTH)
export const updateprofile = async (req, res) => {
  try {
    if (!req.contractor?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const contractorId = req.contractor._id;
    const { phone, address, profession, experienceLevel, bio, rate, skills } = req.body;

    // 🔒 Mandatory check for profile completion
    if (!phone || !profession || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "Phone, Profession and Experience Level are required",
      });
    }

    // 🔍 Check if phone number already exists for a different contractor
    const existingContractor = await Contractor.findOne({ phone: phone });
    if (existingContractor && existingContractor._id.toString() !== contractorId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Please use a different phone number.",
      });
    }

    const formattedSkills = Array.isArray(skills)
      ? skills
          .filter(s => s.name && s.name.trim() !== "")
          .map(s => ({
            name: s.name.trim(),
            rate: s.rate || rate || 500,
          }))
      : [];

    const updatedContractor = await Contractor.findByIdAndUpdate(
      contractorId,
      {
        phone,
        address,
        profession,
        experienceLevel, // ⭐ ADDED
        bio,
        rate,
        skills: formattedSkills,
        profileCompleted: true, // ⭐ FINAL GATE
      },
      { new: true, runValidators: true }
    );

    if (!updatedContractor) {
      return res.status(404).json({ success: false, message: "Contractor not found" });
    }

    await createLog({
      type: "contractor_profile_completed",
      contractorId,
      message: `${updatedContractor.name} completed profile`,
    });

    res.json({ success: true, contractor: updatedContractor });

  } catch (err) {
    console.error("Profile update error:", err);
    
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(400).json({
        success: false,
        message: `${field === 'phone' ? 'Phone number' : 'This field'} already exists. Please use a different value.`,
      });
    }
    
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};




// GET CONTRACTOR BY ID
export const getContractorById = async (req, res) => {
  try {
    const contractorId = req.params.id;

    const contractor = await Contractor.findById(contractorId).select("-password");

    if (!contractor) {
      return res.status(404).json({ success: false, message: "Contractor not found" });
    }

    res.status(200).json({ success: true, contractor });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
