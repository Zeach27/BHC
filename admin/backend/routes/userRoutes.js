const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getUsers, addUser, updateUser, deleteUser, uploadProfileImage } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getUsers);
router.post("/add", addUser);
router.put("/:id", updateUser);
router.post("/:id/upload-profile-image", (req, res, next) => {
	upload.single("profileImage")(req, res, (err) => {
		if (!err) return next();

		if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({ message: "Image too large. Maximum size is 15MB." });
		}

		return res.status(400).json({ message: err.message || "Invalid upload request" });
	});
}, uploadProfileImage);
router.delete("/:id", deleteUser);

module.exports = router;
