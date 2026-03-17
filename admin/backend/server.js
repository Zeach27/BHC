// Import modules
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");

// Initialize app (MUST come before using app)
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Barangay Health API Running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});