const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Midwife', 'Employee'], 
    default: 'Employee' 
  },
  phone: String,
  email: String,
  
  // Enhanced Staff Information
  staffId: { type: String, unique: true },
  birthdate: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: String,
  specialization: String, // e.g., 'Pediatrics', 'Maternal Health'
  assignedPurok: String, // Which purok they primarily handle
  shift: { type: String, enum: ['Morning', 'Afternoon', 'Full Time'], default: 'Full Time' },
  hiredDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  profileImage: String
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
