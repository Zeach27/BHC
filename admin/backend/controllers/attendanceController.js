const Attendance = require("../models/attendance");

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('patient', 'name')
      .populate('event', 'title')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
