const express = require("express");
const upload = require("./config/multer");
const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.json({
      message: "Image uploaded successfully",
      url: req.file.path, // Cloudinary returns the hosted image URL
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
