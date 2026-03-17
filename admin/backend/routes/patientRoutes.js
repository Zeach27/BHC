const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");

// Add patient
router.post("/add", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all patients
router.get("/", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

module.exports = router;