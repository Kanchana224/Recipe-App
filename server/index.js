const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Add body-parser for parsing request bodies
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

dotenv.config();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // Adjust timeout value as needed
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Routes
app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);

// Default route with token verification
app.get("/", verifyToken, (req, res) => {
  res.send("Welcome to the home page");
});

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});

// Middleware function for verifying JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.token = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
}