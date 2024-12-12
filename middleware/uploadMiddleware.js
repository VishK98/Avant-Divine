const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";

    // Ensure the uploads folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Proceed with the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer middleware
const upload = multer({ storage: storage });

module.exports = upload;
