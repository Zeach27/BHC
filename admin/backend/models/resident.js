const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  purok: { type: String, required: true },
  barangay: { type: String, default: "Brgy. Sample" }, // Added barangay
  age: { type: Number }, // Added age
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }, // Added gender
  birthday: { type: Date }, // Added birthday
  idNumber: { type: String }, // Added ID Number (different from MongoDB _id)
  
  // Extra relevant informations
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  vaccinationStatus: { type: String, enum: ['Not Vaccinated', 'Partially Vaccinated', 'Fully Vaccinated', 'Boosted'] },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' },
  profileImage: { type: String }, // Added profile image URL/path
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Resident", ResidentSchema);
