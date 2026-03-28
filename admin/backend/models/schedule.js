const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: String, // Denormalized for simpler display if needed
  date: {
    type: Date,
    required: true
  },
  scheduleType: {
    type: String,
    enum: ['Prenatal', 'Immunization', 'Special Case'],
    required: true
  },
  service: {
    type: String, // e.g., "BCG", "Anti-rabies", "Prenatal Check-up"
    required: true
  },
  doseNumber: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);
