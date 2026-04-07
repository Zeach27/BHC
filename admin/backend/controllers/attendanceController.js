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
    const { patient, event, status, remarks } = req.body;

    // Prevent duplicate attendance for the same patient and event
    const existing = await Attendance.findOne({ patient, event });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this person at this event." });
    }

    const newRecord = new Attendance({ patient, event, status, remarks });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    
    const updatedRecord = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Attendance.findByIdAndDelete(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
