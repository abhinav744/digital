const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config(); // <-- Add this line

console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "Loaded ✅" : "Missing ❌",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌",
});

app.use(express.json());
app.use(cors());

// ----------------- Database connection -----------------
mongoose.connect(
  "mongodb+srv://abhinavchauhan744:7250237622@cluster0.u66grl9.mongodb.net/e-commerce"
);

// ----------------- Cloudinary Config -----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------- Multer Storage (Cloudinary) -----------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// ----------------- API creation -----------------
app.get("/", (req, res) => {
  res.send("Express app is running with Cloudinary 🚀");
});

// ----------------- Image Upload Endpoint -----------------
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: req.file.path, // Cloudinary gives public URL automatically
  });
});

// ----------------- Product Schema -----------------
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// ----------------- Add Product -----------------
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image, // Cloudinary URL comes from frontend
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");

  res.json({
    success: true,
    name: req.body.name,
  });
});

// ----------------- Remove Product -----------------
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// ----------------- Get All Products -----------------
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});

// ----------------- User Schema -----------------
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ----------------- Signup -----------------
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// ----------------- Login -----------------
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong password" });
    }
  } else {
    res.json({ success: false, error: "Wrong Email Id" });
  }
});

// ----------------- New Collection -----------------
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection fetched");
  res.send(newcollection);
});

// ----------------- Popular in Women -----------------
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

// ----------------- Middleware (Auth) -----------------
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ error: "please authenticate using a valid token" });
    }
  }
};

// ----------------- Cart APIs -----------------
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// ----------------- Start Server -----------------
app.listen(port, (error) => {
  if (!error) {
    console.log("✅ Server running on port: " + port);
  } else {
    console.log("❌ Error: " + error);
  }
});
