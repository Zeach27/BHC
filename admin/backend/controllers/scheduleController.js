const Schedule = require("../models/schedule");

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('patient').sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSchedulesByPatient = async (req, res) => {
  try {
    const schedules = await Schedule.find({ patient: req.params.patientId })
      .sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
