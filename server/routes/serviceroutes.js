import express from "express";
import {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getServicesByContractor,
} from "../controllers/serviceControllers.js";
import { verifyTokenContractor } from "../middleware/verifytokenContractor.js"; // middleware to extract contractorId

const router = express.Router();

// Contractor routes
router.post("/", verifyTokenContractor, createService);
router.get("/my", verifyTokenContractor, getMyServices);
router.put("/:id", verifyTokenContractor, updateService);
router.delete("/:id", verifyTokenContractor, deleteService);

// Public route (for user view)
router.get("/contractor/:contractorId", getServicesByContractor);

export default router;
