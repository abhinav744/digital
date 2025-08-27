const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,   // will store Cloudinary URL
  category: String,
  new_price: Number,
  old_price: Number,
  available: Boolean,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
