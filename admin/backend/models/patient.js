const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true },
    name: { type: String, required: true },
    birthdate: Date,
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    civilStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Separated'], default: 'Single' },
    address: String,
    contact: String,
    emergencyContact: {
        name: String,
        relation: String,
        phone: String
    },
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], default: 'Unknown' },
    medicalHistory: [String],
    status: { type: String, enum: ['Active', 'Inactive', 'Transferred', 'Deceased'], default: 'Active' }
}, { timestamps: true });

// Pre-save hook to generate patientId if not exists
PatientSchema.pre('save', function(next) {
    if (!this.patientId) {
        const year = new Date().getFullYear();
        const rand = Math.floor(10000 + Math.random() * 90000);
        this.patientId = `PAT-${year}-${rand}`;
    }
    next();
});

module.exports = mongoose.model("Patient", PatientSchema);