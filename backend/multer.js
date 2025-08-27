// config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // File types
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
