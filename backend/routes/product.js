const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const upload = multer({ dest: "uploads/" }); // temp storage

// Add new product
router.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce_uploads"
    });

    const newProduct = new Product({
      id: req.body.id,
      name: req.body.name,
      image: result.secure_url, // ✅ store Cloudinary URL
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      available: true
    });

    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
