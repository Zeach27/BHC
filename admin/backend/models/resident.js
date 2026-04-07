const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
  // 1. Resident Identity
  residentId: { type: String, unique: true },
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  suffix: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }, 
  birthdate: { type: Date, required: true },
  age: { type: Number },
  nationality: { type: String, default: 'Filipino' },
  civilStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'] },
  religion: String,
  birthplace: String,
  occupation: String,
  monthlyIncome: String,
  contactNumber: String,

  // 2. Spouse Profile
  spouseFirstName: String,
  spouseMiddleName: String,
  spouseLastName: String,
  spouseBirthdate: Date,
  spouseAge: Number,
  spouseNationality: { type: String, default: 'Filipino' },
  spouseOccupation: String,
  spouseMonthlyIncome: String,
  spouseReligion: String,
  spouseBirthplace: String,

  // 3. Children Roster (Highly Detailed)
  childrenRoster: [{
    childFirstName: String,
    childMiddleName: String,
    childLastName: String,
    childBirthdate: Date,
    childAge: Number,
    childGender: String,
    childBirthplace: String,
    childNationality: { type: String, default: 'Filipino' },
    childStatus: String
  }],

  // 4. Household Mapping & Summary
  householdId: { type: String, required: true },
  totalMembersInHousehold: { type: Number, default: 1 },
  
  // Structured Senior Roster
  isAnyMemberSenior: { type: Boolean, default: false },
  seniorRoster: [{
    firstName: String,
    middleName: String,
    lastName: String,
    age: Number,
    birthplace: String,
    healthStatus: String,
    nationality: { type: String, default: 'Filipino' }
  }],

  // Structured PWD Roster
  isAnyMemberPWD: { type: Boolean, default: false },
  pwdRoster: [{
    firstName: String,
    middleName: String,
    lastName: String,
    age: Number,
    disabilityType: String,
    nationality: { type: String, default: 'Filipino' }
  }],

  // 5. Address
  purok: { type: String, required: true },
  barangay: { type: String, required: true },
  municipality: { type: String, required: true },
  province: { type: String, required: true },

  // System
  registeredBy: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

ResidentSchema.pre("save", async function () {
  if (!this.residentId) {
    try {
      const count = await mongoose.model("Resident").countDocuments();
      const year = new Date().getFullYear();
      this.residentId = `RES-${year}-${(count + 1).toString().padStart(4, '0')}`;
    } catch (err) {
      console.error("ID Generation Error:", err);
    }
  }
});

module.exports = mongoose.model("Resident", ResidentSchema);
