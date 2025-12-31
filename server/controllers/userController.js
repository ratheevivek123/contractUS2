import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createLog } from "../utils/createlog.js";   // ⭐ IMPORTANT
dotenv.config();


// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, address, pincode } = req.body;
    console.log(req.body);

    if (!name || !email || !phone || !password || !address || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
     name,
  email,
  phone,
  password: hashedPassword,
  address,
  pincode,
  isGoogleUser: false,
  profileCompleted: true,
    });

    await newUser.save();

    // ⭐ LOG: User Registered
     await createLog({
      action: "user_registered",
      message: `New user registered: ${newUser.name}`,
      user: newUser._id
    });

    res.status(201).json({ message: "User registered successfully" });
    

  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, type: "user" },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    // ⭐ LOG: User Login
    await createLog({
      type: "user_login",
      userId: user._id,
      message: `${user.name} logged in`,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// VERIFY TOKEN
export const verifyToken = async (req, res) => {
  const token = req.cookies.user_token;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ valid: false, message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ valid: false, message: "Your account is blocked" });
    }

    res.status(200).json({ valid: true, user });

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};



// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("user_token");

    // ⭐ LOG: User Logout
    await createLog({
      type: "user_logout",
      message: "User logged out",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// UPDATE USER PROFILE (FIXED & GOOGLE SAFE)
export const updateUserProfile = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please login first." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { name, phone, address, pincode, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔁 Update only provided fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (pincode) user.pincode = pincode;

    if (password && !user.isGoogleUser) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ✅ CHECK PROFILE COMPLETION
    if (user.phone && user.address && user.pincode) {
      user.profileCompleted = true;
    }

    await user.save();

    // ⭐ LOG
    await createLog({
      type: "user_profile_updated",
      userId,
      message: `${user.name} updated profile`,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
