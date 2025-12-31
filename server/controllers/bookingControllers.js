import { Bookingschema as Booking } from "../schema/BookingSchema.js";
import Contractor from "../schema/contractorSchema.js";
import { createLog } from "../utils/createlog.js";

// ⭐ 1. Create Booking
export const createBooking = async (req, res) => {
  try {
    const { user, contractor, date, slot } = req.body;

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "Please select a time slot",
      });
    }

    // 🧾 Fetch contractor rate
    const contractorData = await Contractor.findById(contractor);
    if (!contractorData) {
      return res.status(404).json({ success: false, message: "Contractor not found" });
    }

    // ⭐ Rate extraction
    const rate =
      typeof contractorData.rate === "object"
        ? contractorData.rate.amount
        : contractorData.rate || 500;

    // 🚫 Prevent unfinished repetitive bookings
    const unfinished = await Booking.findOne({
      user,
      contractor,
      status: { $nin: ["completed", "cancelled"] },
    });

    if (unfinished) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot book this contractor again until your previous booking is completed.",
      });
    }

    // 🚫 Prevent duplicate slot booking
    const duplicateBooking = await Booking.findOne({ user, contractor, date, slot });
    if (duplicateBooking) {
      return res.status(400).json({
        success: false,
        message:
          "You have already booked this contractor for this date and time slot.",
      });
    }

    // ✅ Create a new booking
    const booking = new Booking({
      user,
      contractor,
      date,
      slot,
      amount: rate, // ⭐ NEW FIELD
    });

    await booking.save();

    // 📌 Save Logs
    await createLog({
      action: "booking_created",
      message: `New booking created.`,
      user: user,
      contractor: contractor,
      booking: booking._id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   2. Get All Bookings
============================================================ */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("contractor", "name profession phone");

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   3. Get Bookings by USER
============================================================ */
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate("contractor", "name profession phone rate")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });

  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   4. Get Bookings by CONTRACTOR
============================================================ */
export const getBookingsByContractor = async (req, res) => {
  try {
    const { contractorId } = req.params;

    const bookings = await Booking.find({ contractor: contractorId })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching contractor bookings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   5. Update Booking Status
============================================================ */
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    await createLog({
      action: "booking_status_updated",
      message: `Booking status updated to ${booking.status}`,
      booking: booking._id,
      user: booking.user,
      contractor: booking.contractor,
    });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });

  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   6. Delete Booking
============================================================ */
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await createLog({
      action: "booking_deleted",
      message: "A booking was deleted.",
      booking: bookingId,
    });

    res.status(200).json({ success: true, message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/* ============================================================
   7. Get Booking By ID
============================================================ */
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("contractor");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });

  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
