import { Service } from "../schema/ServiceSchema.js";

// ✅ Create Service
export const createService = async (req, res) => {
  try {
    const contractorId = req.contractorId; // from auth middleware
    const { title, description, category, price } = req.body;

    const newService = new Service({
      contractor: contractorId,
      title,
      description,
      category,
      price,
    });

    await newService.save();
    res.status(201).json({ success: true, service: newService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Services of Logged-in Contractor
export const getMyServices = async (req, res) => {
  try {
    const contractorId = req.contractorId;
    console.log("Fetching services for contractorId:", contractorId);
    const services = await Service.find({ contractor: contractorId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const contractorId = req.contractorId;

    const updatedService = await Service.findOneAndUpdate(
      { _id: id, contractor: contractorId },
      req.body,
      { new: true }
    );

    if (!updatedService)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.status(200).json({ success: true, service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const contractorId = req.contractorId;

    const deleted = await Service.findOneAndDelete({
      _id: id,
      contractor: contractorId,
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Services by Contractor ID (for user view)
export const getServicesByContractor = async (req, res) => {
  try {
    const { contractorId } = req.params;
    const services = await Service.find({ contractor: contractorId });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
