const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addUser = async (req, res) => {
  const { name, username, password, role, phone, email } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ name, username, password, role, phone, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;
    user.email = req.body.email || user.email;
    user.birthdate = req.body.birthdate || user.birthdate;
    user.gender = req.body.gender || user.gender;
    user.civilStatus = req.body.civilStatus || user.civilStatus;
    user.barangay = req.body.barangay || user.barangay;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary using buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bhc_profiles",
        public_id: `user_${user._id}`,
        overwrite: true,
        resource_type: "auto",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Failed to upload image to Cloudinary", error: error.message });
        }

        try {
          // Save image URL to database
          user.profileImage = result.secure_url;
          await user.save();

          res.json({
            message: "Profile image updated successfully",
            profileImage: result.secure_url,
            user: user,
          });
        } catch (dbError) {
          console.error("Database update error:", dbError);
          res.status(500).json({ message: "Failed to save image URL to database", error: dbError.message });
        }
      }
    );

    // Pipe the buffer to the upload stream
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
