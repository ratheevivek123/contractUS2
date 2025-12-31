import express from "express";
import { registerContractor , loginContractor,verifyToken,logoutContractor, getAllContractors, updateprofile, getContractorById} from "../controllers/contractorsControllers.js";
import { verifyTokenContractor } from "../middleware/verifytokenContractor.js";
import passport from "passport";
import jwt from "jsonwebtoken";



const router = express.Router();
router.post("/register",registerContractor );
router.post("/login", loginContractor);
router.get("/token", verifyToken);
router.post("/logout", logoutContractor); 
router.get("/allContractors", getAllContractors); 
router.patch("/profile/update",verifyTokenContractor, updateprofile);
/* ===== GOOGLE LOGIN ===== */
router.get(
  "/google",
  (req, res, next) => {
    console.log("🔥 GOOGLE CONTRACTOR ROUTE HIT");
    next();
  },
  passport.authenticate("google-contractor", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google-contractor", {
    session: false,
    failureRedirect: "http://localhost:5173/contractor-login",
  }),
  async (req, res) => {
    try {
      const contractor = req.user;

      if (!contractor) {
        return res.redirect("http://localhost:5173/contractor-login");
      }

      // Check if contractor is blocked
      if (contractor.isBlocked) {
        return res.redirect("http://localhost:5173/contractor-login?error=blocked");
      }

      const token = jwt.sign(
        { contractorId: contractor._id, type: "contractor" },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRATION || "7d" }
      );

      res.cookie("contractor_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      if (!contractor.profileCompleted) {
        return res.redirect("http://localhost:5173/contractor/profile");
      }

      res.redirect("http://localhost:5173/contractor");
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/contractor-login?error=server");
    }
  }
);

router.get("/:id", getContractorById);

// GET /api/contractors
// router.post("/book/:id", bookContractor);
export default router;