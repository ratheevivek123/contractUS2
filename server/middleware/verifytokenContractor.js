import jwt from "jsonwebtoken";
import ContractorSchema from "../schema/ContractorSchema.js";

export const verifyTokenContractor = async (req, res, next) => {
  try {
    const token = req.cookies.contractor_token;  // ✅ token name correct
    console.log("Token from cookies:", token);

    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ extract contractorId from decoded token
    req.contractorId = decoded.contractorId;  // <-- THIS LINE WAS MISSING ❗

    const contractor = await ContractorSchema.findById(decoded.contractorId).select("-password");
    if (!contractor) return res.status(404).json({ message: "Contractor not found" });

    req.contractor = contractor; // optional (if you want full contractor object)
    next();  // continue to controller
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
