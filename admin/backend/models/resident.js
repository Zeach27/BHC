const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model("Resident", ResidentSchema);
