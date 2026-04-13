const multer = require("multer");

// Use memory storage to avoid writing files to disk
const storage = multer.memoryStorage();
const allowedImageExt = /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i;

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const fileName = file.originalname || "";
    const isImageMime = (file.mimetype || "").startsWith("image/");
    const isKnownMobileMime = ["application/octet-stream", "binary/octet-stream"].includes(
      (file.mimetype || "").toLowerCase()
    );
    const hasImageExtension = allowedImageExt.test(fileName);

    // Accept normal image MIME, or common mobile generic MIME with image extension.
    if (isImageMime || (isKnownMobileMime && hasImageExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpg, jpeg, png, webp, gif, heic, heif)"), false);
    }
  },
});

module.exports = upload;
