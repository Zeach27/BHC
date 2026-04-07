const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const Patient = require("./models/patient");
const Resident = require("./models/resident");
const Schedule = require("./models/schedule");
const Event = require("./models/event");
const Record = require("./models/record");
const User = require("./models/user");
const Announcement = require("./models/announcement");

const connectDB = require("./config/db");

const seedDatabase = async () => {
  await connectDB();

  console.log("Clearing old data...");
  await Patient.deleteMany();
  await Resident.deleteMany();
  await Schedule.deleteMany();
  await Event.deleteMany();
  await Record.deleteMany();
  await User.deleteMany();
  await Announcement.deleteMany();

  console.log("Seeding data...");

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const users = await User.insertMany([
    { 
      name: "Arlene Cruz", 
      username: "admin", 
      password: hashedPassword, 
      role: "Admin", 
      email: "arlene@chesms.gov.ph", 
      phone: "09123456789",
      staffId: "ADM-2026-001",
      gender: "Female",
      status: "Active",
      specialization: "Health Informatics",
      assignedPurok: "All",
      shift: "Full Time"
    },
    { 
      name: "Maria Clara Santos", 
      username: "midwife1", 
      password: hashedPassword, 
      role: "Midwife", 
      email: "maria@chesms.gov.ph", 
      phone: "09987654321",
      staffId: "MWF-2026-002",
      gender: "Female",
      status: "Active",
      specialization: "Maternal & Child Health",
      assignedPurok: "Purok 1, 2",
      shift: "Morning"
    },
    { 
      name: "Juan Antonio Dela Cruz", 
      username: "staff1", 
      password: hashedPassword, 
      role: "Employee", 
      email: "juan@chesms.gov.ph", 
      phone: "09111111111",
      staffId: "STF-2026-003",
      gender: "Male",
      status: "Active",
      specialization: "Sanitation & Logistics",
      assignedPurok: "Purok 3",
      shift: "Afternoon"
    },
    { 
      name: "Elena Gilbert", 
      username: "staff2", 
      password: hashedPassword, 
      role: "Employee", 
      email: "elena@chesms.gov.ph", 
      phone: "09222222222",
      staffId: "STF-2026-004",
      gender: "Female",
      status: "On Leave",
      specialization: "Nutrition Specialist",
      assignedPurok: "Purok 4",
      shift: "Morning"
    },
    { 
      name: "Roberto Gomez", 
      username: "midwife2", 
      password: hashedPassword, 
      role: "Midwife", 
      email: "roberto@chesms.gov.ph", 
      phone: "09333333333",
      staffId: "MWF-2026-005",
      gender: "Male",
      status: "Active",
      specialization: "Community Health Nursing",
      assignedPurok: "Purok 5",
      shift: "Full Time"
    }
  ]);

  // 2. Announcements
  await Announcement.insertMany([
    { title: "Measles Outbreak Alert", content: "Please be advised of the recent increase in measles cases in nearby barangays.", category: "Health Alert", priority: "High", author: "Admin Setup" },
    { title: "Monthly Free Clinic", content: "Free checkups and vitamins distribution this Saturday at the center.", category: "Event", priority: "Medium", author: "Maria Clara" },
    { title: "System Maintenance", content: "CHESMS will undergo maintenance on Sunday at 2 AM.", category: "General", priority: "Low", author: "Admin Setup" }
  ]);

  // 3. Patients (Detailed data for enhanced schema)
  const patientData = [];
  const ages = [5, 8, 10, 11, 14, 16, 17, 18, 25, 30, 35, 40, 45, 50, 62, 65, 70, 75, 80, 85];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'O+', 'O-', 'Unknown'];
  const civilStatuses = ['Single', 'Married', 'Widowed', 'Separated'];
  const conditions = ['Asthma', 'Hypertension', 'Diabetes', 'Allergies', 'None', 'Heart Disease'];
  
  for (let i = 0; i < ages.length; i++) {
    const gender = i % 2 === 0 ? "Male" : "Female";
    const bType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const cStatus = ages[i] > 20 ? civilStatuses[Math.floor(Math.random() * civilStatuses.length)] : 'Single';
    const medicalHistory = ages[i] > 40 ? [conditions[1], conditions[2]] : [conditions[Math.floor(Math.random() * conditions.length)]];

    patientData.push({
      patientId: `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      name: `Patient ${i + 1}`,
      age: ages[i],
      gender: gender,
      civilStatus: cStatus,
      bloodType: bType,
      address: `Purok ${Math.floor(Math.random() * 5) + 1}, Barangay Health`,
      contact: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
      emergencyContact: {
        name: `Emergency Contact ${i + 1}`,
        relation: i % 2 === 0 ? 'Parent' : 'Spouse',
        phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`
      },
      medicalHistory: medicalHistory,
      status: i % 10 === 0 ? 'Inactive' : 'Active'
    });
  }
  const insertedPatients = await Patient.insertMany(patientData);

  // 4. Residents (Distribute purok for Purok Density chart)
  const residentData = [];
  for (let i = 0; i < 45; i++) {
    residentData.push({
      fullName: `Resident Name ${i + 1}`,
      username: `res${i + 1}`,
      email: `res${i + 1}@gmail.com`,
      phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
      address: "Barangay Health",
      purok: `${(i % 5) + 1}`, // Puroks 1 to 5
      householdNo: `HH-${100 + i}`,
      status: "Active"
    });
  }
  await Resident.insertMany(residentData);

  // 5. Records (Distribute across the last 12 months for trends, use specific diagnoses for morbidity chart)
  const recordData = [];
  const diagnoses = [
    "Hypertension", "Hypertension", "Hypertension", "High Blood",
    "Diabetes", "Blood Sugar Issue",
    "Fever", "Flu", "Cold", "Fever",
    "Respiratory", "Asthma", "Cough",
    "Prenatal Care", "Consultation", "General Checkup"
  ];
  
  const now = new Date();
  for (let i = 0; i < 150; i++) {
    const pIndex = Math.floor(Math.random() * insertedPatients.length);
    const pat = insertedPatients[pIndex];
    
    // Spread dates over the last 12 months
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * 365));
    
    recordData.push({
      patient: pat._id,
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      treatment: "Prescribed medicine and rest.",
      physician: "Dr. Santos",
      date: date,
      vitals: { weight: "60kg", height: "160cm", bloodPressure: "120/80", temperature: "37C" },
      notes: "Follow up in 2 weeks."
    });
  }
  // Add a few for the last 7 days specifically
  for (let i = 0; i < 15; i++) {
    const pat = insertedPatients[Math.floor(Math.random() * insertedPatients.length)];
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * 7));
    recordData.push({
      patient: pat._id,
      diagnosis: "General Checkup",
      treatment: "Vitamins",
      physician: "Dr. Santos",
      date: date,
      vitals: { weight: "55kg", height: "150cm", bloodPressure: "110/70", temperature: "36.5C" },
      notes: "Healthy."
    });
  }
  await Record.insertMany(recordData);

  // 6. Events (String dates: YYYY-MM-DD or readable. Dashboard uses new Date(e.date))
  const todayStr = new Date().toDateString();
  const nextWeekStr = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toDateString();
  const tomorrowStr = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toDateString();
  const lastWeekStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toDateString();

  await Event.insertMany([
    { title: "Barangay Cleanup Drive", description: "General community cleanup.", date: tomorrowStr, startTime: "08:00 AM", endTime: "12:00 PM", location: "Barangay Hall", capacityTotal: 100, capacityTaken: 45, category: "General", status: "Upcoming" },
    { title: "Free Vaccination Day", description: "For children 0-5 years old.", date: nextWeekStr, startTime: "09:00 AM", endTime: "03:00 PM", location: "Health Center", capacityTotal: 50, capacityTaken: 20, category: "General", status: "Upcoming" },
    { title: "Senior Citizens Assembly", description: "Monthly assembly and checkup.", date: todayStr, startTime: "01:00 PM", endTime: "04:00 PM", location: "Covered Court", capacityTotal: 80, capacityTaken: 80, category: "General", status: "Today" },
    { title: "Nutrition Month Seminar", description: "Health teaching.", date: lastWeekStr, startTime: "10:00 AM", endTime: "12:00 PM", location: "Health Center", capacityTotal: 30, capacityTaken: 25, category: "General", status: "Past" },
  ]);

  // 7. Schedules (Appointments / Clinics)
  const scheduleData = [];
  const scheduleTypes = ['Prenatal', 'Immunization', 'Special Case'];
  for (let i = 0; i < 20; i++) {
    const pat = insertedPatients[Math.floor(Math.random() * insertedPatients.length)];
    const sType = scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)];
    
    // Mix of upcoming and past
    const date = new Date(now);
    const dayOffset = (Math.floor(Math.random() * 20)) - 10; // -10 to +10 days
    date.setDate(now.getDate() + dayOffset);
    
    scheduleData.push({
      patient: pat._id,
      patientName: pat.name,
      date: date,
      scheduleType: sType,
      service: sType === 'Prenatal' ? 'Prenatal Check-up' : (sType === 'Immunization' ? 'Vaccine' : 'Follow-up'),
      doseNumber: Math.floor(Math.random() * 3) + 1,
      status: dayOffset < 0 ? 'Completed' : 'Pending',
      notes: "Regular scheduled visit."
    });
  }
  // Force a couple for today
  scheduleData.push({
    patient: insertedPatients[0]._id,
    patientName: insertedPatients[0].name,
    date: new Date(),
    scheduleType: 'Immunization',
    service: 'Vaccine (Polio)',
    doseNumber: 1,
    status: 'Pending'
  });
  scheduleData.push({
    patient: insertedPatients[1]._id,
    patientName: insertedPatients[1].name,
    date: new Date(),
    scheduleType: 'Prenatal',
    service: 'Prenatal Check-up',
    doseNumber: 2,
    status: 'Pending'
  });
  await Schedule.insertMany(scheduleData);

  console.log("Database seeded successfully!");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
