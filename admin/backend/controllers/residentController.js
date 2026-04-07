const Resident = require("../models/resident");

// Get all residents
exports.getResidents = async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new resident
exports.addResident = async (req, res) => {
  try {
    const data = { ...req.body };
    const newResident = new Resident(data);
    await newResident.save();
    res.status(201).json(newResident);
  } catch (err) {
    console.error("Census Add Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Update resident
exports.updateResident = async (req, res) => {
  try {
    const data = { ...req.body };
    const updated = await Resident.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Census Update Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Delete resident
exports.deleteResident = async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.json({ message: "Resident removed from census" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
