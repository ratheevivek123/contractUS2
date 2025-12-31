import Log from "../schema/LogSchema.js";

export const createLog = async (data) => {
  try {
    const log = new Log({
      action: data.action || data.type,   // convert "type" → "action"
      message: data.message,
      user: data.userId || data.user || null,
      contractor: data.contractorId || data.contractor || null,
      booking: data.bookingId || data.booking || null,
    });

    await log.save();
    console.log("LOG SAVED:", log);

  } catch (err) {
    console.error("❌ Log save failed:", err);
  }
};
