import express from "express";
import { registerUser , loginUser,verifyToken,logoutUser,updateUserProfile} from "../controllers/userController.js";
import passport from "passport";
import jwt from "jsonwebtoken";


const router = express.Router();


router.post("/register", registerUser); // ✅ POST /api/auth/register
router.post("/login", loginUser); // ✅ POST /api/auth/login
router.get("/token", verifyToken );
router.post("/logout", logoutUser);
router.patch("/update-profile", updateUserProfile);

router.get(
  "/google",
  passport.authenticate( "google-user", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate( "google-user", {
    session: false,
    failureRedirect: "http://localhost:5173/user-login",
  }),
  async (req, res) => {
    // 🎯 req.user yahan milta hai
    const user = req.user;

    // JWT same as normal login
    const token = jwt.sign(
      { userId: user._id, type: "user" },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // redirect frontend
    res.redirect("http://localhost:5173/user");
  }
);

export default router;