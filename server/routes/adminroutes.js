import express from "express";
import {  loginAdmin, verifyAdmin, logoutAdmin, getAllUsers, blockOrUnblockUser, getAllContractors, blockOrUnblockContractor, getDashboardCounts, getLogs } from "../controllers/adminControllers.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const router = express.Router();

// Only developer should run this once to create admin


// Login Admin
router.post("/login", loginAdmin);

// Verify Token
router.get("/verify", verifyAdmin);

// Logout Admin
router.post("/logout", logoutAdmin);

router.get("/users",verifyAdminToken, getAllUsers);

// ✅ Block or unblock user (optional feature)
router.patch("/users/:id/block", verifyAdminToken, blockOrUnblockUser);

router.get("/contractors", verifyAdminToken, getAllContractors);
router.patch("/contractors/:id/block", verifyAdminToken, blockOrUnblockContractor);
router.get("/counts", verifyAdminToken, getDashboardCounts);
router.get("/logs", verifyAdminToken, getLogs);


export default router;
