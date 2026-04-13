const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateNextHealthId = async () => {
  const year = new Date().getFullYear();
  const prefix = `CHEMS-${year}-`;
  const regex = new RegExp(`^${prefix}(\\d{3,})$`);

  const latest = await User.findOne({ healthId: new RegExp(`^${prefix}`) })
    .sort({ healthId: -1 })
    .select("healthId");

  let nextNumber = 1;
  if (latest?.healthId) {
    const match = latest.healthId.match(regex);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};

const ensureHealthId = async (user) => {
  if (user.healthId) return user.healthId;
  user.healthId = await generateNextHealthId();
  await user.save();
  return user.healthId;
};

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, birthdate, gender, civilStatus, barangay, street } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate username from email (part before @) and ensure uniqueness
    let username = email.split('@')[0];
    let originalUsername = username;
    let counter = 1;
    
    // Check if username already exists and append numbers if needed
    while (await User.findOne({ username })) {
      username = `${originalUsername}${counter}`;
      counter++;
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      healthId: await generateNextHealthId(),
      role: role || "Resident",
      phone,
      birthdate,
      gender,
      civilStatus,
      barangay,
      address: street,
    });

    // Save user
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        birthdate: user.birthdate,
        gender: user.gender,
        civilStatus: user.civilStatus,
        barangay: user.barangay,
        street: user.address,
        healthId: user.healthId,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await ensureHealthId(user);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        birthdate: user.birthdate,
        gender: user.gender,
        civilStatus: user.civilStatus,
        barangay: user.barangay,
        street: user.address,
        healthId: user.healthId,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;