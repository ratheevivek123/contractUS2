import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByContractor,
  updateBookingStatus,
  deleteBooking,
  getBookingById,
} from "../controllers/bookingControllers.js";

const router = express.Router();

// ✅ POST - Create new booking
router.post("/create", createBooking);

// ✅ GET - All bookings (admin)
router.get("/all", getAllBookings);

// ✅ GET - User bookings
router.get("/user/:userId", getBookingsByUser);

// ✅ GET - Contractor bookings
router.get("/contractor/:contractorId", getBookingsByContractor);

// ✅ PUT - Update booking (status or payment)
router.put("/update/:bookingId", updateBookingStatus);

// ✅ DELETE - Remove booking
router.delete("/delete/:bookingId", deleteBooking);

router.get("/:bookingId", getBookingById);

export default router;
