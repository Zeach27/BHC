const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'patientModel', // Dynamic ref
    required: true
  },
  patientModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Resident'],
    default: 'Patient'
  },
  patientName: String, 
  date: {
    type: Date,
    required: true
  },
  scheduleType: {
    type: String,
    enum: ['Prenatal', 'Post-Natal', 'Immunization', 'Special Case', 'Routine', 'NCD (Hypertension/Diabetes)', 'Family Planning', 'Dental', 'Medical Certificate', 'TB DOTS', 'Nutrition'],
    required: true
  },
  service: {
    type: String, 
    required: true
  },
  urgency: {
    type: String,
    enum: ['Normal', 'Urgent', 'Emergency'],
    default: 'Normal'
  },
  location: {
    type: String,
    enum: ['Health Center', 'Home Visit', 'Satellite Clinic'],
    default: 'Health Center'
  },
  assignedStaff: String, // Midwife or Nurse name
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
