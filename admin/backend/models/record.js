const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  diagnosis: { type: String, required: true },
  treatment: String,
  physician: String,
  date: { type: Date, default: Date.now },
  vitals: {
    weight: String,
    height: String,
    bloodPressure: String,
    temperature: String
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Record", RecordSchema);
