const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Midwife', 'Employee', 'Resident'], 
    default: 'Employee' 
  },
  phone: String,
  email: String,
  healthId: { type: String, unique: true, sparse: true },
  
  // Enhanced Staff Information
  staffId: String,
  birthdate: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: String,
  civilStatus: String,
  barangay: String,
  specialization: String, // e.g., 'Pediatrics', 'Maternal Health'
  assignedPurok: String, // Which purok they primarily handle
  shift: { type: String, enum: ['Morning', 'Afternoon', 'Full Time'], default: 'Full Time' },
  hiredDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  profileImage: String
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
