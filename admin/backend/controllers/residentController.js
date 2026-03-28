const Resident = require("../models/resident");

exports.getResidents = async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addResident = async (req, res) => {
  try {
    const newResident = new Resident(req.body);
    await newResident.save();
    res.status(201).json(newResident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateResident = async (req, res) => {
  try {
    const updated = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.json({ message: "Resident deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
