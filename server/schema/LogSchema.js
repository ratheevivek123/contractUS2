import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },      // e.g. "CONTRACTOR_REGISTERED"
    message: { type: String, required: true },     // readable text
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", default: null },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
